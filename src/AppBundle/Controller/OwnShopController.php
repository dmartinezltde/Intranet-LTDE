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

class OwnShopController extends IntranetController {
  
  var $instanceClass = OwnShop::class;
  var $instance_name = "Tienda propia";
  
  var $formClass = OwnShopType::class;
  var $templateBase = "common/entity/ownshop";
  var $url_prefix = "shop";
  
  public function _getShopRepository($doctrine){
    return $doctrine->getRepository('AppBundle\Entity\OwnShop'); 
  }
}

?>