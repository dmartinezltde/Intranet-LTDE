<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Central.php
 *
 * @ORM\Table(name="central")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\IntranetRepository")
 */
class Central extends Workplace
{

    /**
     * @var \AppBundle\Entity\Address
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Address")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="billing_address_id", referencedColumnName="id")
     * })
     */
    private $billingAddress;

    /**
     * @var \AppBundle\Entity\Email
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Email")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="billing_email_id", referencedColumnName="id")
     * })
     */
    private $billingEmail;

    /**
     * @var \AppBundle\Entity\Phone
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Phone")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="billing_phone_id", referencedColumnName="id")
     * })
     */
    private $billingPhone;


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
     * @return Central.php
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
     * Set billingAddress
     *
     * @param \AppBundle\Entity\Address $billingAddress
     *
     * @return Central.php
     */
    public function setBillingAddress(\AppBundle\Entity\Address $billingAddress = null)
    {
        $this->billingAddress = $billingAddress;

        return $this;
    }

    /**
     * Get billingAddress
     *
     * @return \AppBundle\Entity\Address
     */
    public function getBillingAddress()
    {
        return $this->billingAddress;
    }

    /**
     * Set billingEmail
     *
     * @param \AppBundle\Entity\Email $billingEmail
     *
     * @return Central.php
     */
    public function setBillingEmail(\AppBundle\Entity\Email $billingEmail = null)
    {
        $this->billingEmail = $billingEmail;

        return $this;
    }

    /**
     * Get billingEmail
     *
     * @return \AppBundle\Entity\Email
     */
    public function getBillingEmail()
    {
        return $this->billingEmail;
    }

    /**
     * Set billingPhone
     *
     * @param \AppBundle\Entity\Phone $billingPhone
     *
     * @return Central.php
     */
    public function setBillingPhone(\AppBundle\Entity\Phone $billingPhone = null)
    {
        $this->billingPhone = $billingPhone;

        return $this;
    }

    /**
     * Get billingPhone
     *
     * @return \AppBundle\Entity\Phone
     */
    public function getBillingPhone()
    {
        return $this->billingPhone;
    }
}

