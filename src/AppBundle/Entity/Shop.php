<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Shop
 *
 * @ORM\Table(name="shop")
 * @ORM\InheritanceType("JOINED")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\IntranetRepository")
 */
class Shop extends Workplace
{    
    /**
     * @var integer
     *
     * @ORM\Column(name="shop_type", type="smallint")
     */
    protected $shopType;

    /**
     * @var \AppBundle\Entity\Stock
     *
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\Stock", mappedBy="shop")
     */
    protected $stocks;
    
    const OWNSHOP = 1;
    const FRANCSHOP = 2;
    
    public function __construct() {
        $this->stocks = new ArrayCollection;
    }
    
    public function addStock(\AppBundle\Entity\Stock $stock = null)
    {
        $this->stocks[] = $stock;

        return $this;
    }
    
    public function removeStock(\AppBundle\Entitu\Stock $stock) {
        $this->stocks->removeElement($stock);
    }
    
    public function getStocks()
    {
        return $this->stock;
    }
    
    public function getShopType() {
        return $this->shopType;
    }
    
    public function setShopType($shopType) {
        $this->shopType = $shopType;
        
        return $this;
    }
    
    public function getShopTypeTxt() {
        switch($this->shopType) {
            case self::OWNSHOP:
                return 'Tienda propia';
            case self::FRANCSHOP:
                return 'Tienda Franquiciada';
            default:
                return 'No tiene tipo especificado';
        }
    }
}

