<?php
namespace AppBundle\Controller;

use AppBundle\Controller\IntranetController;
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

class FrancShopController extends IntranetController {
  
  var $instanceClass = FrancShop::class;
  var $instance_name = "Tienda franquiciada";
  
  var $formClass = FrancShopType::class;
  var $templateBase = "common/entity/francshop";
  var $url_prefix = "shop";
  
  public function _getShopRepository($doctrine){
    return $doctrine->getRepository('AppBundle\Entity\FrancShop'); 
  }
}

?>