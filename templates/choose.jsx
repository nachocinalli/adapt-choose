import Adapt from 'core/js/adapt';
import a11y from 'core/js/a11y';
import React from 'react';
import { templates, classes, compile } from 'core/js/reactHelpers';

export default function Choose(props) {
  const ariaLabels = Adapt.course.get('_globals')._accessibility._ariaLabels;

  const {
    _id,
    _isEnabled,
    _isInteractionComplete,
    _isCorrect,
    _canShowMarking,
    displayTitle,
    body,
    instruction,
    onKeyDown,
    onItemOptionFocus,
    onItemOptionBlur,
    onItemOptionSelect,
    _isCorrectAnswerShown,
    isInteractive
  } = props;

  const shouldShowMarking = isInteractive() && _canShowMarking;

  return (
    <div className='component__inner choose__inner'>
      <templates.header {...props} />
      <div
        className={classes([
          'component__widget',
          'choose__widget',
          !_isEnabled && 'is-disabled',
          _isInteractionComplete && 'is-complete is-submitted show-user-answer',
          _isCorrect && 'is-correct'
        ])}
        aria-labelledby={
          (displayTitle || body || instruction) && `${_id}-header`
        } >

        {props._items.map(({ text, _graphic, _options, _index, _isCorrect, _selected }, index) => (
          <div
            className={classes([
              `choose__item item-${index}`,
              _selected && 'is-selected',
              _selected && `selected-option-${_selected._index}`,
              _isInteractionComplete && _isCorrect && 'is-correct',
              _isInteractionComplete && !_isCorrect && 'is-incorrect'
            ])}
            role='radiogroup'
            aria-label={a11y.normalize(text.replace('[]', ''))}
            key={_index}
            data-index={_index} >
            <div
              className={classes([
                'choose__item-state',
                _isInteractionComplete && _isCorrect && 'choose__item-correct-icon',
                _isInteractionComplete && !_isCorrect && 'choose__item-incorrect-icon'
              ])} >
              <div className='icon'></div>
            </div>

            <span className='choose__item-text' aria-hidden="true" dangerouslySetInnerHTML={{ __html: compile(text) }}></span>

            <templates.image {..._graphic}
              classNamePrefixes={['choose__item']}
              attributionClassNamePrefixes={['component', 'choose']}
            />
            <div className='choose__item-choices'>
              {_options.map((option) => (
                <div
                  className={classes([
                    'choose__item-choice',
                    option._isSelected && 'is-selected',
                    option._isHighlighted && 'is-highlighted',
                    !_isEnabled && 'is-disabled',
                    _isCorrectAnswerShown && option._isCorrect && 'is-correct',
                    _isCorrectAnswerShown && !option._isCorrect && 'is-incorrect'
                  ])}
                  key={option._index} >
                  <label
                    aria-hidden="true"
                    htmlFor={`input-${_id}-${_index}-${option._index}`}
                    data-adapt-index={_index} >

                    <span className='choose__item-choice-text' dangerouslySetInnerHTML={{ __html: compile(option.text) }}></span>

                    <templates.image {...option._graphic}
                      classNamePrefixes={['choose__item-choice']}
                      attributionClassNamePrefixes={['component', 'choose']} />

                    <div className='choose__item-icon'>
                      <div className='icon'></div>
                    </div>
                  </label>
                  <input
                    type='radio'
                    name={`choices-${_id}-${_index}`}
                    id={`input-${_id}-${_index}-${option._index}`}
                    value={option._index}
                    disabled={!_isEnabled}
                    aria-label={
                      !shouldShowMarking
                        ? `${
                          _isCorrect
                            ? ariaLabels.correct
                            : ariaLabels.incorrect
                        }, ${a11y.normalize(option.text)}`
                        : `${a11y.normalize(option.text)}`
                    }
                    data-adapt-index={_index}
                    onFocus={onItemOptionFocus}
                    onBlur={onItemOptionBlur}
                    onKeyDown={onKeyDown}
                    onChange={onItemOptionSelect}
                    checked={option._isSelected}
                  />
                </div>
              ))}
            </div>
          </div>
        )
        )}
      </div>

      <div className='btn__container'></div>
    </div>
  );
}
