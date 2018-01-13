<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Shop
 *
 * @ORM\Table(name="shop")
 * @ORM\Entity
 */
class Shop
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=100, precision=0, scale=0, nullable=false, unique=true)
     */
    private $name;
    
    /**
     * @var integer
     *
     * @ORM\Column(name="shop_type", type="smallint")
     */
    private $shopType;

    /**
     * @var \AppBundle\Entity\Stock
     *
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\Stock", mappedBy="shop")
     */
    private $stocks;
    
    const OWNSHOP = 1;
    const FRANCSHOP = 2;
    
    public function __construct() {
        $this->stocks = new ArrayCollection;
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Shop
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
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
}

