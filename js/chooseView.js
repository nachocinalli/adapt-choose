
import QuestionView from 'core/js/views/questionView';
import Adapt from 'core/js/adapt';
class ChooseView extends QuestionView {

  initialize(...args) {
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onItemOptionSelect = this.onItemOptionSelect.bind(this);
    super.initialize(...args);
  }

  setupQuestion() {
    this.model.setupRandomisation();
  }

  onQuestionRendered() {
    this.$('.choose__item').imageready(() => this.setReadyStatus());
    this.setupItems();
  }

  setupItems() {
    const _spaceSize = this.model.get('_spaceSize');
    let _spaces = '';
    for (let i = 0; i < _spaceSize; i++) {
      _spaces += '&nbsp;';
    }
    this.model.get('_items')?.forEach((item) => {
      let _choose = `<span class="choose__replace">${_spaces}</span>`;
      this.updateItem(item, _choose, false);
      if (item._selected) {
        _choose = this.getChoose(item);
        this.updateItem(item, _choose, true);
      }

    });

  }

  getChoose(item) {
    const _hasGraphic = item._selected._graphic && item._selected._graphic.large;
    if (!_hasGraphic) {
      return item._selected.text;
    }
    const _graphic = Adapt.device.screenSize !== 'small' ? item._selected._graphic.large : item._selected._graphic.small;
    return `<img src="${_graphic}"/>`;
  }

  updateItem(item, answer, selected) {
    const $item = this.getItemElement(item);
    if (!selected) {
      const _text = item.text.replace('[]', answer);
      return $item.find('.choose__item-text').html(_text);
    }
    $item.find('.choose__item-text .choose__replace').html(answer);
  }

  getItemElement(item) {
    if (!item) return;
    const index = item._index;
    return this.$('.choose__item').filter(`[data-index="${index}"]`);
  }

  onKeyPress(event) {

    if (event.which !== 13) return;
    this.onItemOptionSelect(event);
  }

  onItemOptionSelect(event) {
    if (!this.model.isInteractive()) return;

    const $input = $(event.currentTarget);
    const itemIndex = $input.data('adapt-index');
    const optionIndex = parseInt($input.val());
    this.model.setOptionSelected(itemIndex, optionIndex, true);
    this.model.set('_highlighted', `${itemIndex}-${optionIndex}`);

    const item = this.model.get('_items')[itemIndex];

    const _choose = this.getChoose(item);
    this.updateItem(item, _choose, true);
  }

  resetQuestion() {
    this.$('.choose__item').removeClass('is-correct is-incorrect is-selected');
    this.$('.choose__item-choice').removeClass('is-correct is-incorrect is-selected');
    this.model.set('_isAtLeastOneCorrectSelection', false);

    this.model.get('_items').forEach(item => {
      const $item = this.getItemElement(item);
      $item.find('.choose__item-text .choose__replace').replaceWith('[]');
      // if (item._isCorrect) return;
      item._options.forEach(option => (option._isSelected = false));
      item._selected = null;

    });

    this.setupItems();
  }

}
ChooseView.template = 'choose.jsx';

export default ChooseView;
