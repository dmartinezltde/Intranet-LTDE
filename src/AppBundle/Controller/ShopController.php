<?php
namespace AppBundle\Controller;

use AppBundle\Controller\IntranetController;
use AppBundle\Entity\Stock;
use AppBundle\Entity\Shop;
use AppBundle\Entity\OwnShop;
use AppBundle\Entity\FrancShop;
use AppBundle\Form\ShopType;
use AppBundle\Form\OwnShopType;
use AppBundle\Form\FrancShopType;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * ProductController.
 *
 * @Route("/admin/shop")
 */
class ShopController extends IntranetController {
  
  var $childController = null;
  
  var $instanceClass = null;
  var $formClass = null;
  var $templateBase = null;
  var $instance_name = null;
  var $url_prefix = 'shop';
  
  /**
   * indexAction
   *
   * @Route("", name="shop_index")
   */
  public function indexAction(Request $request, $arguments = null) {
    if($request->get('shopType')) {
      
      $this->setupController($request->get('shopType'));
      
      $arguments['instances_array'] = $this->childController
        ->_getShopRepository($this->getDoctrine()->getManager())->findAll();
    }
    return parent::_indexAction($request, $arguments);
  }
  
  public function _initialize(Request $request, $instance, $form, $arguments) {
    
    if($form != NULL && $form->isSubmitted() && $form->isValid()) {
      if($instance->getId() == NULL) {
        $em = $this->getDoctrine()->getManager();
        $products = $em->getRepository('AppBundle:Product')->findAll();
        foreach($products as $product) {
          $stock = new Stock();
          $stock->setQuantity(0);
          $stock->setMinQuantity(0);
          $stock->setProduct($product);
          $stock->setShop($instance);
          
          $this->getDoctrine()->getManager()->persist($stock);
          
          $instance->addStock($stock);
          $product->addStock($stock);
        }
        
        if ($instance->getShopType() == Shop::OWNSHOP) {
          
        } elseif ($instance->getShopType() == Shop::FRANCSHOP) {
          
        } else {
          die ('Error on create shop, no exists this type');
        }
      }
    }
    
    return parent::_initialize($request, $instance, $form, $arguments);
  }
  
  protected function _getShopRepository(){
    if ($this->childController!=null){
      return $this->childController->_getShopRepository($this->getDoctrine());
    }
    else{
      return $this->getDoctrine()->getRepository('AppBundle\Entity\Shop');
    }
  }
  
  protected function _getDefaultEditFormAction(Request $request, $id, $getOptions = null){
    $getOptions = ['variable' => 'shopType',
                   'value' => $request->get('shopType')];
    return parent::_getDefaultEditFormAction($request, $id, $getOptions);
  }
  
  protected function _getDefaultEditRedirect($instance, $arguments) {
    $this->generateUrl('shop_index') . '?shopType=' . $instance->getShopType();
  }
  
  /**
   * editAction.
   *
   * @Route("/edit/{id}", name="shop_edit")
   * @param Request $request
   * @param Shop $id
   * @return Response
   */
  public function editAction(Request $request, $id = null) {
    $shop = null;
    $shopType = null;
    
    if ($id != null && $id > 0) {
      $shop = $this->_getShopRepository()->find($id);
      $shopType = $shop->getShopType();
    } elseif($request->get('shopType')) {
      $shopType = $request->get('shopType');
    }
    
    $this->setupController($shopType);
    
    $arguments = [
      'shop'      => $shop,
      'shopType'  => $shopType
    ];
    
    return parent::_editAction($request, $id, $arguments);
  }

  /**
   * listAction.
   *
   * @Route("/list", name="shop_list")
   * @param Request $request
   * @param array|null $arguments
   * @return Response
   */
  public function listAction(Request $request, $arguments = null) {
    $arguments["add_new"] = false;
    return parent::_listAction($request, $arguments);
  }

  /**
   * deleteAction.
   *
   * @Route("/delete/{id}", name="shop_delete")
   * @param Request $request
   * @param Shop $shop
   * @return \Symfony\Component\HttpFoundation\RedirectResponse
   */
  public function deleteAction(Request $request, Shop $shop) {
    return parent::_deleteAction($request, $shop);
  }
  
  public function setupController($shopType) {
    
    if($this->childController != null) { return; }
    
    if($shopType == Shop::OWNSHOP) {
      $this->childController = new OwnShopController();
    } elseif($shopType == SHOP::FRANCSHOP) {
      $this->childController = new FrancShopController();
    } else {
      die('This shop type isn\'t valid');
    }
    
    $this->instanceClass = $this->childController->instanceClass;
    $this->formClass = $this->childController->formClass;
    $this->templateBase = $this->childController->templateBase;
    $this->instance_name = $this->childController->instance_name;
    if(isset($this->childController->formFieldOperators)) {
      $this->formFieldOperators = $this->childController->formFieldOperators;
    }
    
    if(isset($this->childController->filterFormPaths)) {
      $this->filterFormPaths = $this->childController->filterFormPaths;
    }
  }
}

?>