<?php
namespace AppBundle\Controller;

use AppBundle\Controller\IntranetController;
use AppBundle\Entity\ClientType;
use AppBundle\Form\ClientTypeType;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * ClientController.
 *
 * @Route("/admin/clientType")
 */
class ClientTypeController extends IntranetController {
  
  var $templateBase = "common/entity/clientType";
  var $url_prefix = "clientType";
  var $instance_name = "Tipo de Cliente";
  var $instanceClass = ClientType::class;
  var $formClass = ClientTypeType::class;
  
  /**
   * indexAction
   *
   * @Route("", name="clientType_index")
   */
  public function indexAction(Request $request, $arguments = null) {
    return parent::_indexAction($request, $arguments);
  }
  
  /**
   * editAction.
   *
   * @Route("/edit/{id}", name="clientType_edit")
   * @param Request $request
   * @param Payment $id
   * @return Response
   */
  public function editAction(Request $request, $id = null) {
    return parent::_editAction($request, $id, null);
  }

  /**
   * listAction.
   *
   * @Route("/list", name="clientType_list")
   * @param Request $request
   * @param array|null $arguments
   * @return Response
   */
  public function listAction(Request $request, $arguments = null) {
    return parent::_listAction($request, $arguments);
  }

  /**
   * deleteAction.
   *
   * @Route("/delete/{id}", name="clientType_delete")
   * @param Request $request
   * @param Client $client
   * @return \Symfony\Component\HttpFoundation\RedirectResponse
   */
  public function deleteAction(Request $request, ClientType $clientType) {
    return parent::_deleteAction($request, $clientType);
  }
}

?>