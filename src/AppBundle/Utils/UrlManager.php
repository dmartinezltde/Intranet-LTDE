<?php
namespace AppBundle\Utils;

use Symfony\Bundle\FrameworkBundle\Routing\Router;

class UrlManager {

  /** @var Router $router */
  protected $router;

  public function __construct($router) {
    $this->router = $router;
  }

  /**
   * getReferer.
   * Returns the controller and route of the previous action called. If the action needs parameters
   * they are returned in the second element of the response array.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   * @return array
   */
  public function getReferer($request) {
    $params = array();
    try {
      $referer = $request->headers->get('referer');
      $baseUrl = $request->getSchemeAndHttpHost() . $request->getBaseUrl();
      $lastPath = substr($referer, strpos($referer, $baseUrl) + strlen($baseUrl));
      $response = $this->router->getMatcher()->match($lastPath);

      foreach ($response as $k => $v) {
        if ($k != '_controller' && $k != '_route') {
          $params[$k] = $v;
        }
      }
    } catch (\Exception $e) {
      $response = array('_route' => 'homepage');
    }

    return array($response, $params);
  }
}