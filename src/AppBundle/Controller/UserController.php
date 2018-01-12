<?php
namespace AppBundle\Controller;

use AppBundle\Entity\User;
use AppBundle\Form\UserFilterType;
use AppBundle\Form\UserType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Form\FormError;

/**
 * UserController.
 *
 * @Route("/admin/user")
 */
class UserController extends Controller {

  /**
   * indexAction.
   *
   * @Route("", name="user_list")
   * @param Request $request
   * @return \Symfony\Component\HttpFoundation\Response
   */
  public function indexAction(Request $request) {
    $session = $request->getSession();
    $em = $this->getDoctrine()->getManager();

    /** @var \AppBundle\Entity\User $loged */
    $loged = $this->get('security.token_storage')->getToken()->getUser();
    $roleList = $this->getParameter('security.role_hierarchy.roles');

    /** @var \AppBundle\Entity\UserRepository $userRepo */
    $userRepo = $em->getRepository('AppBundle\Entity\User');
    $userRoles = $userRepo->getAllUserRoles($loged, $roleList);

    $filterForm = $this->createForm(UserFilterType::class, null, array('roleList' => $userRoles));
    $filterForm->handleRequest($request);
    if ($filterForm->isSubmitted() && $filterForm->isValid()) {
      $filters = $filterForm->getData();
      $session->set('userFilters', $filters);
    } else {
      $filters = $session->get('userFilters', array());
      $filterForm->setData($filters);
    }
    $users = $userRepo->filterUsers($filters, $loged->getRole());

    return $this->render('user/index.html.twig', array(
      'filterForm' => $filterForm->createView(),
      'users'      => $users
    ));
  }

  /**
   * editAction.
   *
   * @Route("/edit/{id}", name="user_edit")
   * @param Request $request
   * @param int|null $id ID the user to edit, or null to create a new one
   * @return \Symfony\Component\HttpFoundation\Response
   */
  public function editAction(Request $request, $id = null) {
    $em = $this->getDoctrine()->getManager();
    /** @var \AppBundle\Entity\UserRepository $userRepo */
    $userRepo = $em->getRepository('AppBundle\Entity\User');

    /** @var \AppBundle\Entity\User $loged */
    $loged = $this->get('security.token_storage')->getToken()->getUser();
    $roleList = $this->getParameter('security.role_hierarchy.roles');
    $userRoles = $userRepo->getAllUserRoles($loged, $roleList);
    $formOptions = array('roleList' => $userRoles);

    if (is_numeric($id) && $id > 0) {
      $user = $userRepo->find($id);
      $this->denyAccessUnlessGranted($user->getRole(), null, 'Unable to access this page!');
      $formOptions['createUser'] = false;
      $formOptions['roleConfirm'] = ($user->getRole() == 'ROLE_DIRECTOR' || $user->getRole() == 'ROLE_SUPERVISOR' ||
             $user->getRole() == 'ROLE_USER') ? true : false;
      $email = $user->getEmail();
    } else {
      $user = new User();
      $email = false;
      $formOptions['createUser'] = true;
    }
    
    $previous_password = $user->getPassword();
    
    $form = $this->createForm(UserType::class, $user, $formOptions);
    
    $form->handleRequest($request);
    
    $new_password = $form->getData()->getPassword();
    
    if ($form->isSubmitted() && $form->isValid()) {
      $breakPersist = false;
      if (empty($id)) {
        $userSearch = $em->getRepository('AppBundle\Entity\User')->findOneBy(['username' => $form->getData()->getUsername()]);
        if(!empty($userSearch)) {
          $form["username"]->addError(new FormError('This username alredy exists.'));
          $breakPersist = true;
        }
      }
      if (empty($id) || $email) {
        if (empty($id) || $email != $form['email']->getData()) {
          $userSearch = $em->getRepository('AppBundle\Entity\User')->findOneBy(['email' => $form->getData()->getEmail()]);
          if(!empty($userSearch)) {
            $form["email"]->addError(new FormError('This email alredy exists.'));
            $breakPersist = true;
          }
        }
      }
      
      if(!$breakPersist) {
        if (empty($user->getUsername())) {
          $form["username"]->addError(new FormError('User name must be defined.'));
        } else if (empty($new_password) && empty($id)) {
          $form['password']['first']->addError(new FormError('Password must be defined for new users.'));
        } else {
          if (empty($id)) {
            //In the creation of a new user we need to set the password and enable the user
            $user->setPlainPassword($form->getData()->getPassword());
            $user->setEnabled(true);
          } else {
            if (!empty($new_password)) {
              $user->setPlainPassword($new_password);
              $user->setEnabled(true);
            } else {
              $user->setPassword($previous_password);
              $user->setEnabled(true);
            }
          }
          if (is_numeric($id) && $id > 0) {
            if($form['role']->getData() == 'ROLE_DIRECTOR' || $form['role']->getData() == 'ROLE_SUPERVISOR' ||
               $form['role']->getData() == 'ROLE_USER') {
              if (isset($form['responsible'])) {
                if ($form['responsible']->getData() == 1 &&
                   $formOptions['isResponsible'] == false) {
                  $this->setResponsibleByDefault($user);
                } else if ($form['responsible']->getData() == false &&
                   $formOptions['isResponsible'] == true) {
                  $this->setResponsibleByDefault(null);
                }  
              }
            }
          }
          
          $em->persist($user);
          $em->flush();
          $this->addFlash('success', 'Your changes were saved!');
        }
      }
      
    }

    return $this->render('user/edit.html.twig', array(
      'id'   => $id,
      'form' => $form->createView()
    ));
  }

  /**
   * deleteAction.
   *
   * @Route("/delete/{id}", name="user_delete")
   * @param User $user
   * @return \Symfony\Component\HttpFoundation\Response
   */
  public function deleteAction(User $user) {
    /** @var \AppBundle\Entity\User $loged */
    $loged = $this->get('security.token_storage')->getToken()->getUser();

    if ($loged == $user) {
      $this->addFlash('danger', "You can't delete the current user.");
    } else {
      $name = $user->getUsername();
      $em = $this->getDoctrine()->getManager();
      $em->remove($user);
      $em->flush();

      $this->addFlash('success', 'The user "' . $name . '" was deleted.');
    }

    return $this->redirectToRoute('user_list');
  }

  /**
   * selectorAction.
   *
   * @Route("/selector/{inputId}/{inputName}/{profileId}", name="user_selector")
   * @param Request $request
   * @param string $inputId
   * @param string $inputName
   * @param int $profileId
   * @return Response
   */
  public function selectorAction(Request $request, $inputId = 'userId', $inputName = 'userName',
    $profileId = 0
  ) {
    $users = $this->getDoctrine()->getRepository('AppBundle\Entity\User')->findAll();

    return $this->render('user/selector.html.twig', array(
      'users'     => $users,
      'inputId'   => $inputId,
      'inputName' => $inputName,
      'profileId' => $profileId
    ));
  }
  
  private function setResponsibleByDefault($user) {
    $em = $this->getDoctrine()->getManager();
    
    $responsiblesRepo = $em->getRepository('AppBundle\Entity\UserResponsibleByDefault');
    $result = $responsiblesRepo->findOneBy(array('entityName' => 'contract'));
    
    $result->setUser($user);
    
    $em->persist($result);
    $em->flush();
  }
  
  private function getResponsibleByDefault() {
    $em = $this->getDoctrine()->getManager();
    
    $responsiblesRepo = $em->getRepository('AppBundle\Entity\UserResponsibleByDefault');
    $result = $responsiblesRepo->findOneBy(array('entityName' => 'contract'));
    
    if($result != null) {
      return ($result->getUser() != null) ? $result->getUser()->getId() : 0;
    } else {
      return 0;
    }
  }
}