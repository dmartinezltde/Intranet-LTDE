<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Product
 *
 * @ORM\Table(name="product")
 * @ORM\Entity
 */
class Product
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
     * @ORM\Column(name="name", type="string", length=150, precision=0, scale=0, nullable=false, unique=false)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="sku", type="string", length=70, precision=0, scale=0, nullable=false, unique=true)
     */
    private $sku;

    /**
     * @var string
     *
     * @ORM\Column(name="sku_provider", type="string", length=70, precision=0, scale=0, nullable=false, unique=true)
     */
    private $sku_provider;

    /**
     * @var string
     *
     * @ORM\Column(name="cost", type="decimal", precision=10, scale=2, nullable=false, unique=false)
     */
    private $cost;

    /**
     * @var string
     *
     * @ORM\Column(name="pvp", type="decimal", precision=10, scale=2, nullable=false, unique=false)
     */
    private $pvp;

    /**
     * @var \AppBundle\Entity\Stock
     *
     * @ORM\OneToOne(targetEntity="AppBundle\Entity\Stock", inversedBy="product")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="stock_id", referencedColumnName="id", unique=true)
     * })
     */
    private $stock;


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
     * @return Product
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

    /**
     * Set sku
     *
     * @param string $sku
     *
     * @return Product
     */
    public function setSku($sku)
    {
        $this->sku = $sku;

        return $this;
    }

    /**
     * Get sku
     *
     * @return string
     */
    public function getSku()
    {
        return $this->sku;
    }

    /**
     * Set skuProvider
     *
     * @param string $skuProvider
     *
     * @return Product
     */
    public function setSkuProvider($skuProvider)
    {
        $this->sku_provider = $skuProvider;

        return $this;
    }

    /**
     * Get skuProvider
     *
     * @return string
     */
    public function getSkuProvider()
    {
        return $this->sku_provider;
    }

    /**
     * Set cost
     *
     * @param string $cost
     *
     * @return Product
     */
    public function setCost($cost)
    {
        $this->cost = $cost;

        return $this;
    }

    /**
     * Get cost
     *
     * @return string
     */
    public function getCost()
    {
        return $this->cost;
    }

    /**
     * Set pvp
     *
     * @param string $pvp
     *
     * @return Product
     */
    public function setPvp($pvp)
    {
        $this->pvp = $pvp;

        return $this;
    }

    /**
     * Get pvp
     *
     * @return string
     */
    public function getPvp()
    {
        return $this->pvp;
    }

    /**
     * Set stock
     *
     * @param \AppBundle\Entity\Stock $stock
     *
     * @return Product
     */
    public function setStock(\AppBundle\Entity\Stock $stock = null)
    {
        $this->stock = $stock;

        return $this;
    }

    /**
     * Get stock
     *
     * @return \AppBundle\Entity\Stock
     */
    public function getStock()
    {
        return $this->stock;
    }
}

