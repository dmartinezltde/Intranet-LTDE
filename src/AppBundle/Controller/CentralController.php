<?php
namespace AppBundle\Controller;

use AppBundle\Entity\Central;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Form\FormError;

/**
 * CentralController.
 *
 * @Route("/admin/central")
 */
class CentralController extends Controller {
  
  /**
   * function indexAction
   *
   * @Route("", name="central_index")
   */
  public function indexAction(Request $request) {
    $em = $this->getDoctrine()->getManager();
    $centralRepo = $em->getRepository('AppBundle:Central');
    
    $central = $centralRepo->findOneById(1);
    
    return $this->render('central/index.html.twig', array(
      'central' => $central));
  }
}