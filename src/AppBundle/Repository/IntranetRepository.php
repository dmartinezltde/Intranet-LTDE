<?php

namespace AppBundle\Repository;

/**
 * TourknifeRepository.
 */
class IntranetRepository extends \Doctrine\ORM\EntityRepository {

  /**
   * filter any kind of entity
   * Get the entities filtered by the passed parameters.
   *
   * @param array $params. Array with the params to use
   * @param array $orderBy. Array with the order by information with the same format as with symfony findBy
   * @param array $paramOperators. Array with the operators to be used in the filter. If not defined, = is applied
   * @param array $formFieldNameConversions. Array with the conversions of the field name used in the filters and the field name in the DDBB
   * @param array $limit. Limit to be used in the query.
   * @param int $page. Mysql select offset page to be used. It is only used if the limit para is set. 
   * @param bool $only_count. Execute the query but only to count the total number of entities
   *                          without using the limit and offset
   * 
   * @return array
   */
  public function filter($className, $params, $orderBy=null, $parameterOperators=null, 
                         $formFieldNameConversions=null, $limit=null, $page=null, 
                         $onlyCount=False, $alphanumericSortFields=null) {
    
    
    if ($onlyCount==False) {
      $dql = 'SELECT t0 ';
    }
    else {
      $dql = 'SELECT count(t0) ';
    }
         
    $dql .= 'FROM '.$className.' t0 ';
    
    $whe = $par = [];
    $join = [];
    
    $path_prefix_num = 1;
    
    $param_uniq_identifier = 1;
    
    foreach($params as $parameter_key=>$parameter_value){
      
      if ($formFieldNameConversions===null || !array_key_exists($parameter_key, $formFieldNameConversions)){
        $db_parameter_name = $parameter_key;
      }
      else{
        $db_parameter_name = $formFieldNameConversions[$parameter_key];
      }
        
      $whe_index = 0;
      
      if ($parameterOperators===null){
        $operator = "=";
      }
      else if (array_key_exists($parameter_key, $parameterOperators)){
        $operator = $parameterOperators[$parameter_key];
      }
      else {
        $operator = "=";
      }
      
      if (is_array($parameter_value) && array_key_exists("value", $parameter_value)){
        
        $path_prefix = "p".$path_prefix_num."_";
        $path_prefix_num += 1;

        $additional_path_conditions = null;

        if(is_array($parameter_value["value"]) && $operator != "IN" && $operator != "NOT IN"){
          $ar_slice = $parameter_value["path"];
        }
        else{
          if (array_key_exists("path", $parameter_value["path"])) {
            $ar_slice = array_slice($parameter_value["path"]["path"], 0, -1);
            if (array_key_exists("filter", $parameter_value["path"])) {
              $additional_path_conditions = $parameter_value["path"]["filter"];
            }
          }
          else {
            $ar_slice = array_slice($parameter_value["path"], 0, -1);
          }
        }
        
        foreach($ar_slice as $table_index=>$table_column){
          if($table_index==0){
            $join[] = "JOIN t".($table_index).".".$table_column." ".$path_prefix."t".($table_index+1);
          }
          else{
            $join[] = "JOIN ".$path_prefix."t".($table_index).".".$table_column." ".$path_prefix."t".($table_index+1);
          }
          $whe_index += 1;
        }
        
        if(is_array($parameter_value["value"]) && $operator != "IN" && $operator != "NOT IN"){
          foreach($parameter_value["value"] as $inner_key=>$inner_value){
            if ($operator == "LIKE"){
              $inner_value = "%" . $inner_value ."%";
            }
            if ($operator == "IN" || $operator == "NOT IN") {
              $whe[] = 't'.$whe_index.'.'.$inner_key.' '.$operator.' (:'.$inner_key.$param_uniq_identifier.')';
            }
            else {
              $whe[] = 't'.$whe_index.'.'.$inner_key.' '.$operator.' :'.$inner_key.$param_uniq_identifier;
            }
            if ($additional_path_conditions!=null) {
              foreach($additional_path_conditions as $additional_path_condition_column=>$additional_path_condition_value) {
                $whe[] = 't'.$whe_index.'.'.$additional_path_condition_column.' = \''.$additional_path_condition_value.'\'';
              }
            }
            $par[$inner_key.$param_uniq_identifier] = $inner_value;
            $param_uniq_identifier += 1;
          }
        }
        else{
          if (!array_key_exists("path", $parameter_value["path"])) {
            $parameter_key = end($parameter_value["path"]);
            $db_parameter_name = $parameter_key;            
          }
          else {
            $parameter_key = end($parameter_value["path"]["path"]);
            $db_parameter_name = $parameter_key;
          }
          
          $parameter_value = $parameter_value["value"];

          if ($operator == "LIKE"){
            $parameter_value = "%" . $parameter_value ."%";
          }
          if($whe_index>0){
            if ($operator == "IN" || $operator == "NOT IN") {
              $whe[] = $path_prefix.'t'.$whe_index.'.'.$db_parameter_name.' '.$operator.' (:'.$parameter_key.$param_uniq_identifier.')';
            }
            else {
              $whe[] = $path_prefix.'t'.$whe_index.'.'.$db_parameter_name.' '.$operator.' :'.$parameter_key.$param_uniq_identifier;
            }
            if ($additional_path_conditions!=null) {
              foreach($additional_path_conditions as $additional_path_condition_column=>$additional_path_condition_value) {
                $whe[] = $path_prefix.'t'.$whe_index.'.'.$additional_path_condition_column.' = \''.$additional_path_condition_value.'\'';
              }
            }
          }
          else{
            if ($operator == "IN" || $operator == "NOT IN") {
              $whe[] = 't'.$whe_index.'.'.$db_parameter_name.' '.$operator.' (:'.$parameter_key.$param_uniq_identifier.')';
            }
            else {
              $whe[] = 't'.$whe_index.'.'.$db_parameter_name.' '.$operator.' :'.$parameter_key.$param_uniq_identifier;
            }
            if ($additional_path_conditions!=null) {
              foreach($additional_path_conditions as $additional_path_condition_column=>$additional_path_condition_value) {
                $whe[] = 't'.$whe_index.'.'.$additional_path_condition_column.' = \''.$additional_path_condition_value.'\'';
              }
            }
          }
          
          $par[$parameter_key.$param_uniq_identifier] = $parameter_value;
          $param_uniq_identifier += 1;
        }
        
      }
      else{
        if ($operator == "LIKE"){
          $parameter_value = "%" . $parameter_value ."%";
        }
        if ($operator == "IN" || $operator == "NOT IN") {
          $whe[] = 't'.$whe_index.'.'.$db_parameter_name.' '.$operator.' (:'.$parameter_key.')';
        }
        else {
          $whe[] = 't'.$whe_index.'.'.$db_parameter_name.' '.$operator.' :'.$parameter_key;
        }
        $par[$parameter_key] = $parameter_value;
      }
      
    }

    $dql = $dql . join(' ', $join);
    
    if (count($whe)>0) {
      $dql .= ' WHERE ' . join(' AND ', $whe);
    }
    
    if ($orderBy!=null){
      $dql .= " ORDER BY ";
      $orderByList = [];
      foreach($orderBy as $column=>$sortOrder){
        if ($alphanumericSortFields!=null && in_array($column, $alphanumericSortFields)) {
          $orderByList[] = "LENGTH(t0.".$column.") ".$sortOrder;
        }
        $orderByList[] = "t0.".$column." ".$sortOrder;
      }
      $dql .= join(', ', $orderByList);
    }
    
    $query = $this->getEntityManager()->createQuery($dql)->setParameters($par);

    if ($onlyCount==True) {
      return $query->getSingleScalarResult();
    }
    

    if ($limit!==null) {
      
      $query->setMaxResults($limit);
      
      if ($page!=null) {
        $query->setFirstResult($limit*($page-1));
      }
    }
    
    return $query->getResult();

  }
  
  
  /**
   * filter any kind of entity
   * Filter based on several fields based on a single input
   * It applies OR for all the field names
   *
   * @param array $params
   * @return array
   */
  public function simpleFilter($className, $params, $orderBy=null, $parameterOperators=null) {
    
    $dql = 'SELECT e '
         . 'FROM '.$className.' e ';
    
    $whe = $par = [];

    foreach($params as $parameter_key=>$parameter_value){
      if ($parameterOperators===null){
        $operator = "=";
      }
      else if (array_key_exists($parameter_key, $parameterOperators)){
        $operator = $parameterOperators[$parameter_key];
      }
      else {
        $operator = "=";
      }
      
      if ($operator == "LIKE"){
        $parameter_value = "%" . $parameter_value ."%";
      }
      
      $whe[] = 'e.'.$parameter_key.' '.$operator.' :'.$parameter_key;
      $par[$parameter_key] = $parameter_value;
    }

    $dql = $dql . 'WHERE ' . join(' OR ', $whe);
    
    $query = $this->getEntityManager()->createQuery($dql)->setParameters($par);

    return $query->getResult();
  }

}