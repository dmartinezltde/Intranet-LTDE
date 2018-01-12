<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
      //redirect to dashboard if the user is loged in
      if ($this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY')) {
        return $this->forward('AppBundle:Default:dashboard', array());
      }
  
      return $this->render('default/index.html.twig', array());
    }
    
    /**
   * dashboardAction.
   *
   * @Route("/admin", name="dashboard")
   * @param Request $request
   * @return \Symfony\Component\HttpFoundation\Response
   */
  public function dashboardAction(Request $request) {
    return $this->render('default/dashboard.html.twig', array());
  }
}
