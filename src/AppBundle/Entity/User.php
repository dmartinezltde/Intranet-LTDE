<?php
namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use FOS\UserBundle\Model\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="AppBundle\Repository\UserRepository")
 * @ORM\Table(name="user")
 */
class User extends BaseUser {
  
  /**
   * @ORM\Id
   * @ORM\Column(type="integer")
   * @ORM\GeneratedValue(strategy="AUTO")
   */
  protected $id;

  /**
   * @var string $email
   * @Assert\NotBlank
   * @Assert\Email(
   *     message = "The email '{{ value }}' is not a valid email.",
   *     checkMX = true
   * )
   */
  protected $email;

  /**
   * @var string $password
   * @Assert\Length(
   *      min = 5,
   *      minMessage = "The password must be at least {{ limit }} characters long",
   * )
   */
  protected $password;

  /**
   * @var string $phone
   * @ORM\Column(type="string", length=20, nullable=true)
   */
  protected $phone;

  /**
   * @var string $signature
   * @ORM\Column(type="text", nullable=true)
   */
  protected $signature;

  /* Overwriting the default ROLE_USER for the FOSUserBundle, this role is granted to all
   * authenticated users. */
  const ROLE_DEFAULT = 'ROLE_USER';

  public function __construct() {
    parent::__construct();
  }

  /**
   * getRole.
   * Return the highest role of the user.
   *
   * @return string
   */
  public function getRole() {
    return (is_array($this->roles) && count($this->roles) > 0) ? current($this->roles) : null;
  }

  /**
   * setRole.
   *
   * @param string $role
   */
  public function setRole($role) {
    $this->roles = array($role);
  }

    /**
     * Set phone
     *
     * @param string $phone
     *
     * @return User
     */
    public function setPhone($phone)
    {
        $this->phone = $phone;

        return $this;
    }

    /**
     * Get phone
     *
     * @return string
     */
    public function getPhone()
    {
        return $this->phone;
    }

    /**
     * Set signature
     *
     * @param string $signature
     *
     * @return User
     */
    public function setSignature($signature)
    {
        $this->signature = $signature;

        return $this;
    }

    /**
     * Get signature
     *
     * @return string
     */
    public function getSignature()
    {
        return $this->signature;
    }
}
