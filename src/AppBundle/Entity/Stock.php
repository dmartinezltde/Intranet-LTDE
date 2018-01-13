<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Stock
 *
 * @ORM\Table(name="stock")
 * @ORM\Entity
 */
class Stock
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
     * @var integer
     *
     * @ORM\Column(name="quantity", type="integer", nullable=false, unique=false)
     */
    private $quantity;

    /**
     * @var integer
     *
     * @ORM\Column(name="min_quantity", type="integer", nullable=false, unique=false)
     */
    private $minQuantity;
    
    /**
     * @var \AppBundle\Entity\Product
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Product", inversedBy="stocks")
     * @ORM\JoinColumn(name="product_id", referencedColumnName="id")
     */
    private $product;
    
    /**
     * @var \AppBundle\Entity\Shop
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Shop", inversedBy="stocks")
     * @ORM\JoinColumn(name="shop_id", referencedColumnName="id")
     */
    private $shop;

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
     * Set quantity
     *
     * @param integer $quantity
     *
     * @return Stock
     */
    public function setQuantity($quantity)
    {
        $this->quantity = $quantity;

        return $this;
    }

    /**
     * Get quantity
     *
     * @return integer
     */
    public function getQuantity()
    {
        return $this->quantity;
    }

    /**
     * Set minQuantity
     *
     * @param integer $minQuantity
     *
     * @return Stock
     */
    public function setMinQuantity($minQuantity)
    {
        $this->minQuantity = $minQuantity;

        return $this;
    }

    /**
     * Get minQuantity
     *
     * @return integer
     */
    public function getMinQuantity()
    {
        return $this->minQuantity;
    }
    
    public function setProduct(\AppBundle\Entity\Product $product)
    {
        $this->product = $product;
        
        return $this;
    }
    
    public function getProduct() {
        return $this->product;
    }
    
    public function setShop(\AppBundle\Entity\Shop $shop)
    {
        $this->shop = $shop;
        
        return $this;
    }
    
    public function getShop() {
        return $this->shop;
    }
}

