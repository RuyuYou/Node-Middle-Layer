const {Router} = require('express');
const CartController = require('../../controller/cart-controller');


const router = Router();
const cartCtrl = new CartController();

router.get('/', cartCtrl.getAll);
router.get('/:cartId', cartCtrl.getOne);
router.post('/', cartCtrl.create);
router.delete('/:cartId', cartCtrl.delete);
router.put('/:cartId', cartCtrl.update);

module.exports = router;