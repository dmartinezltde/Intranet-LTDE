<?php
namespace AppBundle\Helper;

class GeneralHelper {
    
    /**
     * Save the EntityManager
     */
    protected $em;
    
    /**
     * Save one Repository
     */
    protected $repository;
    
    /**
     * Save one Entity
     */
    protected $entity;
    
    /**
     * Construct of GeneralHelper class. This function is executed on first action
     * The finality of this function is complete general variables like $em.
     */
    public function __construct() {
        $this->em = $this->loadEntityManager();
    }
    
    /**
     * function loadEntityManager
     *
     * This function take the entityManager from Bundle and save it in $em variable
     * @return EntityManager
     */
    public function loadEntityManager() {
        return false;
    }
    
    /**
     * function loadRepository
     * 
     * This function take a Repository by name and save it in $repository variable.
     *
     * @string Name $name
     * @return repository
     */
    public function loadRepository($repositoryName) {
       $this->repository = $this->em->getRepository(
            'AppBundle\\Entity\\' . $repositoryName
        );
       
       return $this->repository; 
    }
    
    /**
     * function setEntity
     * 
     * Setter for Entity $entity
     *
     * @Object Entity $entity
     */
    public function setEntity($entity) {
        $this->entity = $entity;
    }
    
    /**
     * function getEntity
     *
     * Getter for Entity $entity
     *
     * @return Entity $entity
     */
    public function getEntity() {
        return $this->entity;
    }
    
    /**
     * function findByFromEntity
     *
     * This function run findBy function from the repository of the loaded entity
     *
     * @findBy
     * @return Array
     */
    public function findByFromEntity($findBy) {
        // TO MAKE with reflection class.
    }
}