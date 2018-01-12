<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Staff
 *
 * @ORM\Table(name="staff")
 * @ORM\Entity
 */
class Staff
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
     * @ORM\Column(name="name", type="string", length=255, nullable=false, unique=false)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="code", type="string", length=6, nullable=false, unique=true)
     */
    private $code;

    /**
     * @var string
     *
     * @ORM\Column(name="website", type="string", length=255, nullable=false, unique=false)
     */
    private $website;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="birthdate", type="date", nullable=true, unique=false)
     */
    private $birthdate;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="registrationdate", type="date", nullable=false, unique=false)
     */
    private $registrationdate;

    /**
     * @var string
     *
     * @ORM\Column(name="nationality", type="string", length=255, nullable=false, unique=false)
     */
    private $nationality;

    /**
     * @var boolean
     *
     * @ORM\Column(name="allow_buy", type="boolean", nullable=false, unique=false)
     */
    private $allowBuy;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="AppBundle\Entity\Address")
     * @ORM\JoinTable(name="staff_address",
     *   joinColumns={
     *     @ORM\JoinColumn(name="staff_id", referencedColumnName="id", onDelete="CASCADE")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="address_id", referencedColumnName="id", unique=true, nullable=false)
     *   }
     * )
     */
    private $addresses;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="AppBundle\Entity\Phone")
     * @ORM\JoinTable(name="staff_phone",
     *   joinColumns={
     *     @ORM\JoinColumn(name="staff_id", referencedColumnName="id", onDelete="CASCADE")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="phone_id", referencedColumnName="id", unique=true, nullable=false)
     *   }
     * )
     */
    private $phones;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="AppBundle\Entity\Email")
     * @ORM\JoinTable(name="staff_email",
     *   joinColumns={
     *     @ORM\JoinColumn(name="staff_id", referencedColumnName="id", onDelete="CASCADE")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="email_id", referencedColumnName="id", unique=true, nullable=false)
     *   }
     * )
     */
    private $emails;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->addresses = new \Doctrine\Common\Collections\ArrayCollection();
        $this->phones = new \Doctrine\Common\Collections\ArrayCollection();
        $this->emails = new \Doctrine\Common\Collections\ArrayCollection();
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
     * @return Staff
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
     * Set code
     *
     * @param string $code
     *
     * @return Staff
     */
    public function setCode($code)
    {
        $this->code = $code;

        return $this;
    }

    /**
     * Get code
     *
     * @return string
     */
    public function getCode()
    {
        return $this->code;
    }

    /**
     * Set website
     *
     * @param string $website
     *
     * @return Staff
     */
    public function setWebsite($website)
    {
        $this->website = $website;

        return $this;
    }

    /**
     * Get website
     *
     * @return string
     */
    public function getWebsite()
    {
        return $this->website;
    }

    /**
     * Set birthdate
     *
     * @param \DateTime $birthdate
     *
     * @return Staff
     */
    public function setBirthdate($birthdate)
    {
        $this->birthdate = $birthdate;

        return $this;
    }

    /**
     * Get birthdate
     *
     * @return \DateTime
     */
    public function getBirthdate()
    {
        return $this->birthdate;
    }

    /**
     * Set registrationdate
     *
     * @param \DateTime $registrationdate
     *
     * @return Staff
     */
    public function setRegistrationdate($registrationdate)
    {
        $this->registrationdate = $registrationdate;

        return $this;
    }

    /**
     * Get registrationdate
     *
     * @return \DateTime
     */
    public function getRegistrationdate()
    {
        return $this->registrationdate;
    }

    /**
     * Set nationality
     *
     * @param string $nationality
     *
     * @return Staff
     */
    public function setNationality($nationality)
    {
        $this->nationality = $nationality;

        return $this;
    }

    /**
     * Get nationality
     *
     * @return string
     */
    public function getNationality()
    {
        return $this->nationality;
    }

    /**
     * Set allowBuy
     *
     * @param boolean $allowBuy
     *
     * @return Staff
     */
    public function setAllowBuy($allowBuy)
    {
        $this->allowBuy = $allowBuy;

        return $this;
    }

    /**
     * Get allowBuy
     *
     * @return boolean
     */
    public function getAllowBuy()
    {
        return $this->allowBuy;
    }

    /**
     * Add address
     *
     * @param \AppBundle\Entity\Address $address
     *
     * @return Staff
     */
    public function addAddress(\AppBundle\Entity\Address $address)
    {
        $this->addresses[] = $address;

        return $this;
    }

    /**
     * Remove address
     *
     * @param \AppBundle\Entity\Address $address
     */
    public function removeAddress(\AppBundle\Entity\Address $address)
    {
        $this->addresses->removeElement($address);
    }

    /**
     * Get addresses
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getAddresses()
    {
        return $this->addresses;
    }

    /**
     * Add phone
     *
     * @param \AppBundle\Entity\Phone $phone
     *
     * @return Staff
     */
    public function addPhone(\AppBundle\Entity\Phone $phone)
    {
        $this->phones[] = $phone;

        return $this;
    }

    /**
     * Remove phone
     *
     * @param \AppBundle\Entity\Phone $phone
     */
    public function removePhone(\AppBundle\Entity\Phone $phone)
    {
        $this->phones->removeElement($phone);
    }

    /**
     * Get phones
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getPhones()
    {
        return $this->phones;
    }

    /**
     * Add email
     *
     * @param \AppBundle\Entity\Email $email
     *
     * @return Staff
     */
    public function addEmail(\AppBundle\Entity\Email $email)
    {
        $this->emails[] = $email;

        return $this;
    }

    /**
     * Remove email
     *
     * @param \AppBundle\Entity\Email $email
     */
    public function removeEmail(\AppBundle\Entity\Email $email)
    {
        $this->emails->removeElement($email);
    }

    /**
     * Get emails
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getEmails()
    {
        return $this->emails;
    }

    /**
     * Set identity
     *
     * @param \AppBundle\Entity\Identity $identity
     *
     * @return Staff
     */
    public function setIdentity(\AppBundle\Entity\Identity $identity = null)
    {
        $this->identity = $identity;

        return $this;
    }

    /**
     * Get identity
     *
     * @return \AppBundle\Entity\Identity
     */
    public function getIdentity()
    {
        return $this->identity;
    }

    /**
     * Add economicData
     *
     * @param \AppBundle\Entity\EconomicData $economicData
     *
     * @return Staff
     */
    public function addEconomicData(\AppBundle\Entity\EconomicData $economicData)
    {
        $this->economicDatas[] = $economicData;

        return $this;
    }

    /**
     * Remove economicData
     *
     * @param \AppBundle\Entity\EconomicData $economicData
     */
    public function removeEconomicData(\AppBundle\Entity\EconomicData $economicData)
    {
        $this->economicDatas->removeElement($economicData);
    }

    /**
     * Get economicDatas
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getEconomicDatas()
    {
        return $this->economicDatas;
    }
}

