<?php
namespace AppBundle\Helper\Classes;

class Argument {
    
    /**
     * The name of Argument
     */
    private $name;
    
    /**
     * The value of Argument
     */
    private $value;
    
    public function setName($name) {
        $this->name = $name;
    }
    
    public function getName() {
        return $this->name;
    }
    
    public function setValue($value) {
        $this->value = $value;
    }
    
    public function getValue() {
        return $this->value;
    }
}