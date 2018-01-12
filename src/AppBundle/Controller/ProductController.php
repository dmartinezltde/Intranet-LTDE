<?php
namespace AppBundle\Controller;

use AppBundle\Controller\IntranetController;
use AppBundle\Entity\Product;
use AppBundle\Entity\Stock;
use AppBundle\Form\ProductType;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * ProductController.
 *
 * @Route("/admin/product")
 */
class ProductController extends IntranetController {
  
  var $templateBase = "common/entity/product";
  var $url_prefix = "product";
  var $instance_name = "Producto";
  var $instanceClass = Product::class;
  var $formClass = ProductType::class;
  
  /**
   * indexAction
   *
   * @Route("", name="product_index")
   */
  public function indexAction(Request $request, $arguments = null) {
    return parent::_indexAction($request, $arguments);
  }
  
  public function _initialize(Request $request, $instance, $form, $arguments) {
    if($form != NULL && $form->isSubmitted() && $form->isValid()) {
      if($instance->getStock() == NULL) {
        $em = $this->getDoctrine()->getManager();
        $shops = $em->getRepository('AppBundle:Shop');
        foreach($shops as $shop) {
          $stock = new Stock();
          $stock->setQuantity(0);
          $stock->setMinQuantity(0);
          
          $this->getDoctrine()->getManager()->persist($stock);
          
          $instance->setStock($stock);
        }
      }
    }
    
    return parent::_initialize($request, $instance, $form, $arguments);
  }
  
  /**
   * editAction.
   *
   * @Route("/edit/{id}", name="product_edit")
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
   * @Route("/list", name="product_list")
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
   * @Route("/delete/{id}", name="product_delete")
   * @param Request $request
   * @param Product $product
   * @return \Symfony\Component\HttpFoundation\RedirectResponse
   */
  public function deleteAction(Request $request, Product $product) {
    return parent::_deleteAction($request, $product);
  }
}

?>