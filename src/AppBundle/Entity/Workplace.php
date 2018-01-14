<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Central.php
 *
 * @ORM\Table(name="workplace")
 * @ORM\InheritanceType("JOINED")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\IntranetRepository")
 */
class Workplace
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255, nullable=false, unique=true)
     */
    protected $name;
    
    /**
     * @ORM\OneToMany(targetEntity="Staff", mappedBy="workplace")
     */
    protected $staff;
    
    protected function __construct() {
      $this->staff = new ArrayCollection();
    }

    /**
     * Get id
     *
     * @return integer
     */
    protected function getId()
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
    protected function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    protected function getName()
    {
        return $this->name;
    }
    
    protected function addStaff(\AppBundle\Entity\Staff $staff = null)
    {
        $this->staff[] = $staff;

        return $this;
    }
    
    protected function removeStaff(\AppBundle\Entitu\Staff $staff) {
        $this->staff->removeElement($staff);
    }
    
    protected function getStaff()
    {
        return $this->staff;
    }

}

