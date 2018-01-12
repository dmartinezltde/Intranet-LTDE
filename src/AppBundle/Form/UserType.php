<?php
namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserType extends AbstractType {
  public function buildForm(FormBuilderInterface $builder, array $options) {
    $builder
      ->add('username', TextType::class, array('label' => 'Usuario',
        'required' => true,
        'disabled' => ($options['createUser']) ? '' : 'disabled'))
      ->add('email', EmailType::class)
      ->add('phone', TextType::class, array('label' => 'Teléfono',
        'required' => false))
      ->add('role', ChoiceType::class, array('label' => 'Rol',
        'choices' => $options['roleList']))
      ->add('signature', TextareaType::class, array('label' => 'Firma',
        'required' => false,
        'attr' => ['class' => 'wysiwyg']))
    ;
    
    if ($options['createUser']) {
      $password_required = true;
    }
    else {
      $password_required = false;
    }
    
    $builder->add('password', RepeatedType::class, array(
                  'type' => PasswordType::class,
                  'invalid_message' => 'Las contraseñas deben coincidir',
                  'options' => array('attr' => array('class' => 'password-field')),
                  'required' => $password_required,
                  'first_options'  => array('label' => 'Contraseña'),
                  'second_options' => array('label' => 'Repite la contraseña'),
    ));

  }

  public function configureOptions(OptionsResolver $resolver) {
    $resolver->setDefaults(array(
      'data_class' => 'AppBundle\Entity\User',
      'roleList'   => array(),
      'createUser' => false,
      'roleConfirm' => false,
    ));
  }
}