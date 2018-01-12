<?php
namespace AppBundle\Repository;

/**
 * UserRepository
 */
class UserRepository extends \Doctrine\ORM\EntityRepository {

  /**
   * filterUsers.
   *
   * @param array $filters
   * @param string $role The role for the loged in user
   * @return array
   */
  public function filterUsers($filters, $role = 'ROLE_USER') {
    $dql = 'SELECT u FROM AppBundle:User u ';

    $whe = $params = array();
    if (array_key_exists('name', $filters) && !empty($filters['name'])) {
      $whe[] = 'u.username LIKE :name';
      $params['name'] = $filters['name'];
    }
    if (array_key_exists('role', $filters) && !empty($filters['role'])) {
      $whe[] = 'u.roles LIKE :role';
      $params['role'] = '%' . $filters['role'] . '%';
    }
    if ($role != 'ROLE_SUPER_ADMIN') {
      //Only the super-admins can see the super-admin and retailer users
      $whe[] = "u.roles NOT LIKE '%ROLE_SUPER_ADMIN%' AND u.roles NOT LIKE '%ROLE_RETAILER%'";
    }

    if (count($whe) > 0) {
      $dql .= 'WHERE ' . join(' AND ', $whe);
    }

    $query = $this->getEntityManager()->createQuery($dql)->setParameters($params);
    return $query->getResult();
  }

  /**
   * getUsers.
   * Lists all system users with the possibility of not list users admin.
   *
   * @param boolean $admins Flag filter non admin users
   * @param boolean $retailers Flag filter non retailer users
   * @return array
   */
  public function getUsers($admins = false, $retailers = false) {
    $dql = 'SELECT u FROM AppBundle:User u ';

    $params = $whe = array();
    if (!$admins) {
      $whe[] = 'u.roles not like :role_adm ';
      $params['role_adm'] = '%' . User::ROLE_SUPER_ADMIN . '%';
    }
    if (!$retailers) {
      $whe[] = 'u.roles not like :role_ret ';
      $params['role_ret'] = '%ROLE_RETAILER%';
    }

    if (count($whe) > 0) {
      $dql .= 'WHERE ' . join(' AND ', $whe);
    }

    $query = $this->getEntityManager()->createQuery($dql)->setParameters($params);
    return $query->getResult();
  }

  /**
   * getAllUserRoles.
   * Return all roles that user has in a single array, including roles by heritage.
   *
   * @param User $user
   * @param array $roleList
   * @return array
   */
  public function getAllUserRoles($user, $roleList) {
    $userRoles = [];
    for ($i=1; $i<=count($roleList); $i++) {
      foreach ($roleList as $role => $subroles) {
        if ($user->hasRole($role) || in_array($role, $userRoles)) {
          $userRoles[$role] = $role;

          if (is_array($subroles)) {
            foreach ($subroles as $subrol) {
              $userRoles[$subrol] = $subrol;
            }
          }
        }
      }
    }
    if (count($userRoles) == 0) {
      $userRoles['ROLE_USER'] = 'ROLE_USER';
    }

    return $userRoles;
  }
}
