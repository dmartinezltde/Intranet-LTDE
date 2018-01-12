<?php
namespace AppBundle\Controller;

use AppBundle\Controller\IntranetController;
use AppBundle\Entity\Client;
use AppBundle\Form\ClientType;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * ClientController.
 *
 * @Route("/admin/client")
 */
class ClientController extends IntranetController {
  
  var $templateBase = "common/entity/client";
  var $url_prefix = "client";
  var $instance_name = "Cliente";
  var $instanceClass = Client::class;
  var $formClass = ClientType::class;
  
  /**
   * indexAction
   *
   * @Route("", name="client_index")
   */
  public function indexAction(Request $request, $arguments = null) {
    return parent::_indexAction($request, $arguments);
  }
  
  /**
   * editAction.
   *
   * @Route("/edit/{id}", name="client_edit")
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
   * @Route("/list", name="client_list")
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
   * @Route("/delete/{id}", name="client_delete")
   * @param Request $request
   * @param Client $client
   * @return \Symfony\Component\HttpFoundation\RedirectResponse
   */
  public function deleteAction(Request $request, Client $client) {
    return parent::_deleteAction($request, $client);
  }
}

?>