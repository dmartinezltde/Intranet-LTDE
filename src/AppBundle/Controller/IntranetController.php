<?php
namespace AppBundle\Controller;

use AppBundle\Entity;
use AppBundle\Form\MultipleEntityEditorType;

use AppBundle\Form\SearchType;

use Doctrine\Common\Collections\ArrayCollection;

use Symfony\Component\Form\Extension\Core\Type\HiddenType;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;


use Symfony\Component\Form\Extension\Core\Type\CollectionType;

/**
 * IntranetController.
 *
 * Base controller to be used for all the instances in Intranet
 * 
 */
class IntranetController extends Controller {
  
  var $formFieldOperators = null;
  var $filterFormPaths = null;
  var $formFieldNameConversions = null;
  var $limitInstances = null;
  var $ignoreFormFields = null;
  var $maxInstancesToList = null;
  var $alphanumericSortFields = null;

  /*
  * Checks if the form values are correct, for the given form and the given instance, if defined 
  * 
  * @return bool
  */
  protected function checkValid($form, $instance=null){
    return true;
  }
  
 /*
  * Checks if the mulitple edit form is correct for the given instances
  * 
  * @return bool
  */
  protected function checkMultipleEditValid($form, $instances){
    return true;
  }

 /*
  * Get an array of additional portlets to be shown at the bottom of the index page
  */
  protected function _getAdditionalIndexPortlets(Request $request){
    return array();
  }

  protected function _getAdditionalIndexPortletBeforeList(Request $request, $arguments=null){
    return array();
  }
  
  /*
  * Get an array of additional portlets to be shown in the edition page
  */
  protected function _getEditPageAdditionalPortlets(Request $request, $arguments){
    return array();
  }
  
  /* Gets the single input filter form to be displayed in the header of a portlet */
  protected function _getSimpleFilter(Request $request, $arguments){
    
    $filterForm = $this->createForm(SearchType::class);
    $filterForm->handleRequest($request);
    
    return $filterForm;
  }  
  
  /**
   * getFilterForm.
   * Portlets for the filter form. If the filter form class is not defined, 
   * by default this parent class returns null.
   *
   * @param Request $request
   * @return array
   */
  public function _getFilterFormPortlet(Request $request, $arguments) {
    
    if (!property_exists($this, "filterFormClass")) {
      return null;
    }
    
    if ($this->filterFormClass==null) {
      return null;
    }
    
    /* Pre-fill by default the filter form */
    if (array_key_exists("filterFormDefaultOptions", $arguments)){
      $filterFormDefaultOptions = $arguments["filterFormDefaultOptions"];
    }
    else{
      $filterFormDefaultOptions = array();
    }
    
    $filterForm = $this->createForm($this->filterFormClass, 
                                    null,
                                    $filterFormDefaultOptions);
     
    
    if ($request->get("reset_filter") == null){
      $filterForm->handleRequest($request);
    }

    $arguments["filterForm"] = $filterForm;
    
    //$filterFormView = $this->renderView('common/entity/simple_filter_form.html.twig', array(
    $filterFormView = $this->renderView('common/entity/filter_form.html.twig', array(
      'base_template_url' => $this->templateBase,
      'filterForm'        => $filterForm->createView(),
    ));
    
    $arguments["content"] = array($filterFormView);

    return $this->renderView('common/entity/filter.html.twig', $arguments);
  }

 /*
  * Generic function to get the form of multiple ediction of entities
  */
  protected function _getUpdateForm($instances, $arguments=null){
    
    if($arguments==null){ $arguments = array(); }	
    if(!array_key_exists("action", $arguments)){ $arguments["action"] = null; }

    $ainstances = array("instances" => $instances);

    $updateForm = $this->createForm(MultipleEntityEditorType::class, $ainstances,
                                    array(
              'action'         => $arguments["action"],
              'instance_class' => $this->formClass,
    ));

    return $updateForm;
  }
  
 /*
  * Prepare the list of instances to be used in the editable table
  * 
  * Create an array collection with the ids of the instances as keys of the array collection
  * 
  */
  protected function _instancesToUpdateForm($instances){
    
    $instancesArray = new ArrayCollection();

    foreach($instances as $instance){
      $instancesArray[$instance->getId()] = $instance;
    }

    return $instancesArray;
  }
  
  /*
  * Prepare the list of instances to be highlighted in the table
  * 
  * Return an array with the selected instances to be highlighted
  * 
  * @return array
  */
  protected function _getHighLightInstances($instances){
    return array();
  }
  
  /*
  * Prepare the list of instances to be highlighted in the table
  * 
  * Return an array with the selected instances to be underlighted
  * 
  * @return array
  */
  protected function _getUnderLightInstances($instances){
    return array();
  }
  
  protected function _getDefaultFilters($request, $arguments){
    return array();
  }
  
  
  /**
   * Generic function to count the instances that would be retrieved
   * but without retrieving them, using the generic_getInstances method
   *
   * @param Request $request
   * @param array $arguments
   * @param array $orderBy
   * 
   **/
  private function _countInstances($request, $arguments) {
    return $this->__getInstances($request, $arguments, null, True);
  }
  
  
  private function __getInstances($request, $arguments, $orderBy, $onlyCount) {
    
    $em = $this->getDoctrine()->getManager();
    
    // Adds specific filters that are not shown in the form
    // For example, disabled entities, etc
    $filterParams = $this->_getDefaultFilters($request, $arguments);
    
    // Adds the filters obtained in the form. If necessary, 
    // the form overwrites default specific filters
    if (property_exists($this, "filterFormClass")){
      $filterParams = array_merge($filterParams, $this->_processFilterForm($request, $this->filterFormClass));
    }
    
    // Adds the filters obtained in short search form.
    $filterParams = array_merge($filterParams, $this->_processFilterForm($request, searchType::class));
    
    if($this->ignoreFormFields != null){
      foreach($this->ignoreFormFields as $ignoredFormField){
        unset($filterParams[$ignoredFormField]);
      }
    }
    
    
    /* Check the pagination page that is being looked */
    $current_page = $request->get("page", null);
    
    $tkRepo = $this->getDoctrine()->getRepository($this->instanceClass);
    
    if (count($filterParams)>0){
      
      /* Detect if it is the simplified filter form or the detailed filter form */
      if (array_key_exists("searchBy", $filterParams)){
        $newFilterParams = array();
        foreach($this->simpliedFilterFormFields as $searchField){
          $newFilterParams[$searchField] = $filterParams["searchBy"];
        }
        $instances = $tkRepo->simpleFilter($this->instanceClass,
                                           $newFilterParams,
                                           $orderBy,
                                           $this->formFieldOperators);
      }
      else{
        $instances = $tkRepo->filter($this->instanceClass, 
                                     $filterParams,
                                     $orderBy,
                                     $this->formFieldOperators,
                                     $this->formFieldNameConversions,
                                     $this->maxInstancesToList,
                                     $current_page,
                                     $onlyCount,
                                     $this->alphanumericSortFields);
      }
      
    }
    else {
      $instances = $tkRepo->filter($this->instanceClass,
                                   [],
                                   $orderBy,
                                   [],
                                   [],
                                   $this->maxInstancesToList,
                                   $current_page,
                                   $onlyCount,
                                   $this->alphanumericSortFields);
    }
    
    return $instances;

  }
  
  /*
   * Generic function to get the list of instances to be shown
   * 
   * If there is a filter defined, it filters the instances with the data set in the filter
   * 
   */
  protected function _getInstances($request, $arguments=null, $orderBy=null){
    
    if ($orderBy==null && $request->get("order_by", null)!==null) {
      $column = $request->get("order_by");
      
      if ($request->get("order_type", null)===null) {
        $orderType = "DESC";
      }
      else {
        $orderType = strtoupper($request->get("order_type"));
      }
    
      if ($orderType!="DESC" && $orderType!="ASC") {
        return new Response("The order type only can be ASC or DESC");
      }
      
      $orderBy = [$column=>$orderType];
    }
    
    $instances = $this->__getInstances($request, $arguments, $orderBy, False);
    
    return $this->_instancesToUpdateForm($instances);
  
  }
  
  /* Process advanced filter */
  protected function _processFilterForm($request, $formClass){
    
    $params = [];
      
    /*
    if (!property_exists($this, "filterFormClass")) {
      return $params;
    }
    
    if ($this->filterFormClass==null){
      return $params;
    }*/
    
    if($formClass==null){
      return $params;
    }
    
    $filterForm = $this->createForm($formClass);
    
    if ($request->get("reset_filter") == null){
      $filterForm->handleRequest($request);
    }
    
    $formData = $filterForm->getData();
    
    if ($filterForm->isValid()){
      
      $formData = $filterForm->getData();
      foreach($formData as $field_name=>$field_value){
        if (!empty($field_value) || $field_value===0){
          $filterFormPaths = $this->_getFilterFormPaths();
          if ($filterFormPaths==null || !array_key_exists($field_name, $filterFormPaths)){
            $params[$field_name] = $field_value;
          }
          else{
            $params[$field_name] = array("path"  => $filterFormPaths[$field_name],
                                         "value" => $field_value);
          }
        }
      }
    }
    
    return $params;

  }
  
  /**
   * Get the array of filter form paths
   *
   * @return array
   */
  protected function _getFilterFormPaths() {
    return $this->filterFormPaths;
  }
  
  protected function tableAction(Request $request, $arguments=null){
    if ($arguments==null){
      $arguments = array();
    }
    
    if (!array_key_exists("actions", $arguments)) {
      if (array_key_exists("selector", $arguments) && $arguments["selector"] == true){
        $arguments["actions"] = array("select"=>0);
      }
      else {
        $arguments["actions"] = array("delete"=>0, "edit"=>0);
      
        /* Check if the duplicate action is defined */
        $router = $this->container->get('router');
        if ($router->getRouteCollection()->get($this->url_prefix.'_duplicate')){
          $arguments["actions"]["duplicate"] = 0;
        }
      }
    }
    return $this->_tableAction($request, $arguments);
  }
  
  
 /*
  * Generic function to show a portlet with a list of entities
  */
  protected function _listAction(Request $request, $arguments=null) {
	  
    /* Fill the default arguments */
    if($arguments==null){ $arguments = array(); }	
    if(!array_key_exists("editable", $arguments)){ $arguments["editable"] = false; }
    if(!array_key_exists("add_new", $arguments)){ $arguments["add_new"] = true; }
    
    /* Get the instances that will be shown, in order to correctly set the subtitle in the list portlet */
    /* This should be from the table action, but as we return the response content, it would not be possible */
    /* to get the result number from here. */
    if (!array_key_exists("instances_array", $arguments)) {
      $instancesArray = $this->_getInstances($request, $arguments);
      $arguments["instances_array"] = $instancesArray;
      
      /* If the controllers is set for pagination, then count the total number
       * of instances in the database. Otherwise, only count the instances in the array */
      if ($this->maxInstancesToList!=null) {
        $arguments["num_found"] = $this->_countInstances($request, $arguments);
      }
      else {
        $arguments["num_found"] = count($instancesArray);
      }
    }
    else {
      $instancesArray = $arguments["instances_array"];
      $arguments["num_found"] = count($instancesArray);
    }
    
    $arguments["num_shown"] = count($instancesArray);
	
    if(!array_key_exists("base_template_url", $arguments)){
      $arguments["base_template_url"] = $this->templateBase;
    }
    if(!array_key_exists("editable", $arguments)){
      $arguments["editable"] = false;
    }
    
    /* Add pagination arguments */
    $arguments = array_merge($arguments, $this->__getPaginatedArguments($request));
    
    
    // In development. Add a simple filter 
    //$arguments["filter_form"] = $this->_getSimpleFilter($request, $arguments)->createView();

    $table = $this->tableAction($request, $arguments)->getContent();
    $arguments["portlets"] = [$table];
    
    return new Response($this->renderView('common/entity/list.html.twig', $arguments));
  }
  
  /**
   * Generic function to create a selector portlet
   */
  protected function _selectorAction(Request $request, $arguments = null) {
	  
    if (empty($arguments)) {
	    $arguments = array();
	  }
	  if (!array_key_exists("base_template_url", $arguments)) {
	    $arguments["base_template_url"] = $this->templateBase;
    }
    
    $arguments["selector"] = true;
    $arguments["add_new"] = false;
    
    
    $portlets = array();
    
    $portlets[] = $this->_getFilterFormPortlet($request, $arguments);
    $portlets[] = $this->listAction($request, $arguments)->getContent();
    
    $arguments["portlets"] = $portlets;
        
    $arguments["selectorInputId"]   = $request->get('inputId', 0);
    $arguments["selectorInputName"] = $request->get('inputName', 0);
    $arguments["selectorMultiple"]  = $request->get('multiple', "undefined");
    
    $target = $request->get('target', 0);
    $targetId = $request->get('targetId', 0);
    $actionPath = $request->get('action_path', '');
    $referer_key = $request->get('referer_key', '');
    
    if(!empty($actionPath)){
      $actionUrl = $this->generateUrl($actionPath, array('id'=> 'XXX', $target=> $targetId, 'refererKey'=>$referer_key));
      $arguments["selectorActionUrl"] = $actionUrl;
    }
    else{
      $arguments["selectorActionUrl"] = "";
    }
    
    return $this->render('common/entity/selector.html.twig', $arguments);
  }

  /**
   * _indexAction.
   *
   * Generic function to show a complete page with the filter portlet and the list of instances    
   *
   * @param Request $request
   * @param array|null $arguments
   * @return Response
   */
  protected function _indexAction(Request $request, $arguments = null) {
	  
    if (empty($arguments)) {
	    $arguments = array();
	  }
	  if (!array_key_exists("base_template_url", $arguments)) {
	    $arguments["base_template_url"] = $this->templateBase;
    }
    
    /* Add pagination arguments */
    $arguments = array_merge($arguments, $this->__getPaginatedArguments($request));
    
    $portlets = [];
    $filterPortlet = $this->_getFilterFormPortlet($request, $arguments);
    if ($filterPortlet != null){
      $portlets[] = $filterPortlet;
    }

    $portlets = array_merge($portlets, $this->_getAdditionalIndexPortletBeforeList($request, $arguments));
    
    $portlets = array_merge($portlets, [$this->listAction($request, $arguments)->getContent()]);
    
    $portlets = array_merge($portlets, $this->_getAdditionalIndexPortlets($request));
	
	  $arguments["portlets"] = $portlets;

    return $this->render('common/entity/index.html.twig', $arguments);
  }
  
  /**
   * Function to fill the mandatory pagination argument
   * 
   * @param Request $request
   * 
   * @return array $arguments
   **/
  private function __getPaginatedArguments(Request $request) {
    
    $arguments = [];
    
    if ($this->maxInstancesToList!=null) {
      $arguments["paginated"] = True;
      $arguments["maxInstancesToList"] = $this->maxInstancesToList;
      
      /* If the maxInstancesToList is defined and the page is not set,
       * redirecto to the list page with the page */
      $page = $request->get("page", null);
      
      $arguments["page"] = $request->get("page",1);
    }
    
    return $arguments;
  }

 /*
  * Generic function to get the table of the list of entities
  */
  public function _tableAction(Request $request, $arguments=null, $instancesArray=null){
	
    /* Fill the default table arguments */
    if($arguments==null){ $arguments = array(); }	
    if(!array_key_exists("editable", $arguments)){ $arguments["editable"] = false; }
    if(!array_key_exists("create_new_row", $arguments)){ $arguments["create_new_row"] = false; }
    if(!array_key_exists("updateFormView", $arguments)){ $arguments["updateFormView"] = null; }
  
    /* Get the instances that will be shown in the table */
    if (array_key_exists("instances_array", $arguments)) {
      $instancesArray = $arguments["instances_array"];
    }
    else{
      $instancesArray = $this->_getInstances($request, $arguments);
    }
    
    if($this->limitInstances!=null && count($instancesArray)>$this->limitInstances){
      return new Response("Too many information. Please, restrict the search with the filters above.");
    }
    
    if ($arguments["editable"] && $arguments["updateFormView"] == null){
      $arguments["updateFormView"] = $this->_getUpdateForm($instancesArray, "")->createView();
    }
	
    if ($arguments["create_new_row"] == true){
      $newForm = $this->createForm($this->formClass, null, array(
        'action' => $this->generateUrl($this->url_prefix."_edit")));
      $newFormView = $newForm->createView();
    }
    else{
      $newFormView = null;
    }
	
    /* Group the instances in case they should be shown grouped */
    list($grouped_instances, $grouped_instances_col, $group_actions) = $this->_groupInstances($instancesArray);

    return new Response($this->renderView('common/entity/editable_table.html.twig', array(
      'base_template_url'       => $this->templateBase,
      'editable'                => $arguments["editable"],
      'instances'               => $instancesArray,
      'highlighted_instances'	  => $this->_getHighLightInstances($instancesArray),
      'grouped_instances'       => $grouped_instances,
      'grouped_instances_col'   => $grouped_instances_col,
      'group_actions'           => $group_actions,
      'create_new_row'          => $arguments["create_new_row"],
      'new_form'                => $newFormView,
      'update_form'             => $arguments["updateFormView"],
      'specificArguments'       => array_key_exists("specificArguments", $arguments) ? $arguments["specificArguments"] : array(),
      'actions'		        			=> array_key_exists("actions", $arguments) ? $arguments["actions"] : array(),
      )));
  }
  
  /* Group the instances to be shown in the instances table */
  protected function _groupInstances($instancesArray){
    return array(null, null, null);
  }
  
  /* Initialize instances (new instances or instances based on form) */
  protected function _initialize(Request $request, $instance, $form, $arguments){
    return true;
  }

  /* Generic method to get an array with the additional form options in the edit form */
  protected function _getAdditionalEditFormOptions($instance, $arguments){
    return array();
  }
  
  protected function __getFormFields($form){
    $form_fields = array(""=>array());
    foreach($form as $key => $value){
        $form_fields[""][] = array($key);
    }
    return $form_fields;
  }
  
  protected function _redirectTo($key, $arguments){
    return false;
  }
  
  protected function _duplicateInstance($instance, $source_instance){
    return true;
  }
  
  protected function _preFillDuplicate($activity, $source_activity){
    return true;
  }
  
  protected function _getDefaultEditFormAction($id){
    return $this->generateUrl($this->url_prefix.'_edit', array("id"=>$id));
  }

  /**
   * _editAction.
   * Prints the edition form for the correspnding entity.
   *
   * @param Request $request
   * @param int $id The entity PK identifier
   * @param array|null $arguments
   * @param bool $complete_page
   * @param object|null $instance
   * @return Response
   * @throws \Exception
   */
  protected function _editAction(Request $request, $id = null, $arguments = null,
    $complete_page = true, $instance = null
  ) {
	  if ($arguments == null) {
	    $arguments = array();
	  }
    /** @var \Doctrine\ORM\EntityManager $em */
    $em = $this->getDoctrine()->getManager();

    if ($instance == null) {
      if (is_numeric($id) && $id > 0) {
        $instance = $em->getRepository($this->instanceClass)->find($id);
      } else {
        $instance = new $this->instanceClass();
      }
    }    
    
    /* Moved from the new instances to here. The _initialize should consider that may work with not
     * newly created instances. */
    $this->_initialize($request, $instance, null, $arguments);
    
    // If it is a duplication, initialize duplication information
    if (array_key_exists("source", $arguments)) {
      if ($arguments["source"]=="duplication") {
        $this->_preFillDuplicate($instance, $arguments["source_instance"]);
      }
    }
    
    if (!array_key_exists("form_options", $arguments)) {
      $arguments["form_options"] = array();
    }
    
    // Fill the form with custom options
    $form_action = $this->_getDefaultEditFormAction($id);
    if ($form_action) {
      $arguments["form_options"]["action"] = $form_action;
    }
    
    $arguments["form_options"] = array_merge($arguments["form_options"],
      $this->_getAdditionalEditFormOptions($instance, $arguments));
    
    // Create form
    $form = $this->createForm($this->formClass, $instance, $arguments["form_options"]);
    
    /* Add a hidden field to the form with the referer to use */
    if (!$form->has("referer")) {
	    $form->add('referer', HiddenType::class, array('mapped'=>false));
	  }
    
    /* Detect source instance for duplication events.
     * Store in the form if the creation is from a duplication or not */
    if (!$form->has("duplication")) {
      $form->add('duplication', HiddenType::class, array('mapped'=>false));
      // Detect if it is a duplication
      if (array_key_exists("source", $arguments)) {
        if ($arguments["source"]=="duplication") {
          $form->get('duplication')->setData($arguments["source_instance"]->getId());
        }
      } else {
        $form->get('duplication')->setData(0);
      }
    }

    $form->handleRequest($request);

    if ($this->_initialize($request, $instance, $form, $arguments) == false) {
      $this->addFlash('danger', 'There was a problem when initializing the ' . $this->instance_name);
      // JAVI. When it arrives here, it should not save. To do. IMPORTANT.
    }

    if ($form->isSubmitted() && $form->isValid()) {
      if ($this->checkValid($form, $instance)) {
        $this->makeCommunication($instance);
        $em->persist($instance);
        try {
          $em->flush();

          if ($form->has("duplication") && $form["duplication"]->getData() != 0) {
            $source_instance = $em->getRepository($this->instanceClass)
              ->find($form->get('duplication')->getData());
            $this->_duplicateInstance($instance, $source_instance);
          }

          // Create necessary relations OneToMany, ManyToOne, etc
          if (!$this->_create_relations($instance, $arguments)) {
            $this->addFlash('danger', 'Some relations were not saved. Check the data is correct.');
          }
          
          // Execute the necessary functions after persisting or removing the instance
          // For example, avaiability updates
          if (!$this->_execute_after_persist($instance, $arguments)) {
            $this->addFlash('danger', 'There were some problems when saving the entity.');
          }

          // JAVI TO CHECK IN  THE CASE OF CURRENCY EXCHANGE //
          /* Call specific calls from children after saving */
          /*
          if ($id == null && $this->_create_relations($instance, $arguments)){
            $this->addFlash('success', 'Your changes were saved!');
          }
          */ 

          $this->addFlash('success', 'Se han guardado los cambios!');
          
          /* If the form is found in a modal, close the modal automatically */
          /* How to do this generically? */
          if (array_key_exists("in_modal", $arguments) && $arguments["in_modal"]) {
            return $this->redirect($this->generateUrl("close_modal"));
          }
          
          // If the submit action has a specified redirect to, redirect to it
          if (array_key_exists("submit_redirect", $arguments)) {
            if (array_key_exists($request->get("submit"), $arguments["submit_redirect"])) {
              $redirectTo = str_replace('XXX', $instance->getId(),
                $arguments["submit_redirect"][$request->get("submit")]);
              return $this->redirect($redirectTo);
            }
          }
          
          $redirectTo = $this->_getDefaultEditRedirect($instance, $arguments);
          if ($redirectTo != null) {
            return $this->redirect($redirectTo);
          }
                  
          // If the form contains a referer, redirect to it
          if ($form->has("referer") && $form["referer"]->getData() != "") {
            $redirectTo = $form["referer"]->getData();
            if (strpos($redirectTo, 'httpsPort') === false) {
              return $this->redirect($redirectTo);
            }
          }

          /* If the request has a redirectTo key, redict to it */ 
          $redirectTo = $request->get('redirectTo', '');
          $redirectTo = $this->_redirectTo($redirectTo, array("id"=>$instance->getId()));
          if ($redirectTo != false) {
            return $this->redirect($redirectTo);
          }
          
          /* Finally, if any of the previous conditions is satisfied, 
           * return to the previos page */
          list($return, $params) = $this->get('url_manager')->getReferer($request);
          $referer = $this->generateUrl($return['_route'], $params);

          return $this->redirect($referer);
        } catch(\Exception $e) {
          $message = $e->getMessage();
          if (preg_match("/(Duplicate entry '.+') for key/" , $message, $matches)) {
            $this->addFlash('danger', 'Error: ' . $matches[1]);
          } else {
            throw($e);
            //$this->addFlash('danger', 'Error: an exception occurred. The changes were not saved.');
          }
        }
      } else {
        $this->addFlash('danger', 'The changes were not saved. Check the data is correct.');
      }
    } elseif ($form->isSubmitted()) {
      $this->addFlash('danger', 'The changes were not saved. Check the data is correct.');
    }
	
	  if (!$form->isSubmitted()) {
	    list($return, $params) = $this->get('url_manager')->getReferer($request);
	    $referer = $this->generateUrl($return['_route'], $params);
	    $form->get('referer')->setData($referer);
	  } else {
	   $referer = $form->get("referer")->getData();
	  }

    $formView = $this->renderView('common/entity/edit_form.html.twig', array(
      'id'                  => $id,
      'form'                => $form->createView(),
	    'base_template_url'   => $this->templateBase,
	    'form_fields'		      => $this->__getFormFields($form),
      'instance'            => $instance,
	    'form_cancel'		      => (array_key_exists("in_modal", $arguments) && $arguments["in_modal"]) ? $this->generateUrl('close_modal') : $referer,
      'form_action'         => $form_action,
      'additional_portlets' => $this->_getEditPageAdditionalPortlets($request, $arguments),
    ));

	  $formPortlet = $this->renderView('common/entity/edit_form_portlet.html.twig', array(
	    'base_template_url' => $this->templateBase,
      'instance'          => $instance,
      'subtitle'          => array_key_exists("subtitle", $arguments) ? $arguments["subtitle"] : "",
      'title'             => array_key_exists("title", $arguments) ? $arguments["title"] : null,
      'content'			      => [$formView]
	  ));

    if ($complete_page){
      return $this->render('common/entity/edit_form_page.html.twig', array(
                    'instance'          => $instance,
                    'breadcrumb'        => $this->_getBreadCrumb($instance),
                    'base_template_url' => $this->templateBase,
                    'base_url'          => $this->generateUrl("homepage"),
                    'portlets'          => [$formPortlet]));
    } else {
      return new Response($formPortlet);
    }
  }

  protected function makeCommunication($instance) {
    return true;
  }

  /* Generic function to get the array with the links of the breadcrumb in the base page */
  protected function _getBreadCrumb($instance){
    return null;
  }
  
  /* Generic function to create additional entity relations when editing an entity */
  /* It returns boolean */
  protected function _create_relations($instance, $arguments){
    return true;
  }
  
  /**
   * Generic function to execute when an instance has been persisted or removed
   * 
   * @param Entity $instance. TK instance that is persisted or remved
   * @param array $arguments.  Array of specific arguments if they are necessary
   *
   * return boolean
   **/
  protected function _execute_after_persist($instance, $arguments){
    return true;
  }
  
  /**
   * Generic function to execute before an instance has been removed
   * 
   * @param Entity $instance. TK instance that is persisted or remved
   * @param array $arguments.  Array of specific arguments if they are necessary
   *
   * return boolean
   **/
  protected function _execute_before_remove($instance, $arguments){
    return true;
  }
  
  /**
   * Generic function to execute after an instance has been removed
   * 
   * @param Entity $instance. TK instance that is persisted or remved
   * @param array $arguments.  Array of specific arguments if they are necessary
   *
   * return boolean
   **/
  protected function _execute_after_remove($instance, $arguments){
    return true;
  }
  
  
  /* Get the default url to redirect after success in the edit page */
  protected function _getDefaultEditRedirect($instance, $arguments){
    return null;
  }


 /**
  * editable_columns
  * table_columns
  * success_redirect
  */
  protected function _multipleEditAction(Request $request, $arguments, $complete_page=true) {
    
    $editable_columns = $arguments["editable_columns"];
    $table_columns = $arguments["table_columns"];

    $em = $this->getDoctrine()->getManager();

    $instancesArray = $this->_getInstances($request, $arguments);
    
    $arguments["instances_array"] = $instancesArray;

    if( !array_key_exists("request_parameters", $arguments) ){
      $arguments["request_parameters"] = array();
    }
    
    $form_action = $this->generateUrl($this->url_prefix.'_multiple_edit', $arguments["request_parameters"]);
    $form = $this->_getUpdateForm($instancesArray, array("action"=>$form_action));
    
    foreach($form as $subform){
      foreach($subform as $key => $value){
        foreach($table_columns as $column){
          if (!in_array($column, $editable_columns)){
            $subform->remove($column);
          }
        }
      }
    }
	
    if(!$form->has("referer")){
      $form->add('referer',HiddenType::class, array('mapped'=>false));
    }
	
    $form->handleRequest($request);
    
    if ($form->isSubmitted() && $form->isValid()) {
      if( $this->checkMultipleEditValid($form, $instancesArray) ){
        foreach($instancesArray as $instance){
          $em->persist($instance);
        }
        $em->flush();
        
        // Create necessary relations OneToMany, ManyToOne, etc
        foreach ($instancesArray as $instance) {
          if (!$this->_create_relations($instance, $arguments)) {
            $this->addFlash('danger', 'Some relations were not saved. Check the data is correct.');
          }
        }
        
        if (array_key_exists("success_redirect", $arguments) ){
          return $this->redirect($arguments["success_redirect"]);
        }
        if($form->has("referer")){
          return $this->redirect($form["referer"]->getData()); 
        }
      }
    }
    elseif( $form->isSubmitted() && !$form->isValid() ){
      $this->addFlash('danger', 'Error processing the form');
    }

	  $arguments["editable"] = true;
    $arguments["updateFormView"] = $form->createView();
  
    if ($complete_page){
      return $this->_indexAction($request, $arguments);
    }
    else{
      return $this->listAction($request, $arguments);
    }
  }
  
  protected function _getDefaultEditArguments(Request $request, $instance, $cloned=false){
    return array();
  }
  
  /* Generic method to duplicate an instance */
  protected function _duplicateAction(Request $request, $instance) {
    
    $cloned = clone $instance;
    
    $arguments = ["source"             => "duplication",
                  "source_instance"    => $instance];
                  
    $arguments = array_merge($arguments, $this->_getDefaultEditArguments($request, $cloned, true));
    
    return $this->_editAction($request, null, $arguments, true, $cloned);
  }
  
  //REMOVE PERMANENTLY FROM THE DATABASE. ALERT!!! NO POSSIBLE UNDO!
  protected function _deleteAction(Request $request, $instance) {
    
    $em = $this->getDoctrine()->getManager();

    try {
      
      if (!$this->_execute_before_remove($instance, [])) {
        $this->addFlash('danger', 'There were some problems when deleting the entity.');
      }
      
      $em->remove($instance);
      $em->flush();
      
      if (!$this->_execute_after_remove($instance, [])) {
        $this->addFlash('danger', 'There were some problems after deleting the entity.');
      }

      $this->addFlash('success', 'The ' . $this->instance_name . ' was deleted.');
      
    } catch (\Exception $e) {
      $this->addFlash('danger', $e->getMessage());
    }
    
    list($return, $params) = $this->get('url_manager')->getReferer($request);
    $referer = $this->generateUrl($return['_route'], $params);
    
    return $this->redirect($referer);
  }
  
    /**
   * searchAction.
   * Returns a json with the list of entities that start with the
   * indicated characters in $query.
   *
   * @param string $query
   * @return \Symfony\Component\HttpFoundation\Response
   */
  public function _searchAction($query = '') {
    /** @var \AppBundle\Entity\DestinationRepository $destinationRepo */
    
    if (strlen($query)<2){
      return new JsonResponse([]);
    }
    
    $tkRepo = $this->getDoctrine()->getRepository($this->instanceClass);
    
    $entities = $tkRepo->filter($this->instanceClass,
                                ["name"=>$query],
                                ["name"=>"ASC"],
                                ["name"=>"LIKE"]);
    
    $data = array();
    /** @var Destination $d */
    foreach ($entities as $entity) {
      $data[] = array('id' => $entity->getId(), 'name' => $entity->getName());
    }

    return new JsonResponse($data);
  }

}