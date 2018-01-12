<?php
namespace AppBundle\Utils;

use AppBundle\Utils\HTML\HTMLView;
use AppBundle\Utils\HTML\Link;
use AppBundle\Utils\HTML\HTMLCheckbox;
use AppBundle\Utils\HTML\HTMLTextArea;


use Symfony\Component\HttpFoundation\Response;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\PersistentCollection;


class LinkManager {
  
  /** @var Router $router */
  protected $router;

  public function __construct($router) {
    $this->router = $router;
  }
  
  public function createLink($entity, $parentInstance=null) {
    #return $entity;
    return str_replace("\n","<br/>",$entity);
  }
}
