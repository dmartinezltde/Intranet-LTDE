<?php
namespace AppBundle\Form;

use Doctrine\ORM\EntityRepository;
use AppBundle\Entity\Destination;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserFilterType extends AbstractType {
  public function buildForm(FormBuilderInterface $builder, array $options) {
    $builder
      ->add('name', TextType::class, array('label' => 'Nombre',
                                           'required' => false))
      ->add('role', ChoiceType::class, array('label' => 'Rol',
                                             'required' => false, 'choices' => $options['roleList']))
    ;
  }

  public function configureOptions(OptionsResolver $resolver) {
    $resolver->setDefaults(array(
      'roleList' => array()
    ));
  }
}