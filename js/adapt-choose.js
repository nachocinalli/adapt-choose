import Adapt from 'core/js/adapt';
import ChooseView from './chooseView';
import ChooseModel from './chooseModel';

export default Adapt.register('choose', {
  view: ChooseView,
  model: ChooseModel
});
