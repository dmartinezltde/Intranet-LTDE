<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use AppBundle\Entity\Shop;

/**
 * OwnShop
 *
 * @ORM\Table(name="own_shop")
 * @ORM\Entity
 */
class OwnShop extends Shop
{

    public function __construct() {
        $this->shopType = Shop::OWNSHOP;
        parent::__construct();
    }
}

