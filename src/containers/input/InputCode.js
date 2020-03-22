import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, TextInput, ViewPropTypes} from 'react-native';
import {withTheme} from 'src/components';
import _ from 'lodash';
import {borderRadius, padding} from 'src/components/config/spacing'
import fonts, {sizes} from 'src/components/config/fonts'
// if ViewPropTypes is not defined fall back to View.propType (to support RN < 0.44)
const viewPropTypes = ViewPropTypes || View.propTypes;

class InputCode extends Component {
  static propTypes = {
    codeLength: PropTypes.number,
    compareWithCode: PropTypes.string,
    inputPosition: PropTypes.string,
    size: PropTypes.number,
    space: PropTypes.number,
    ignoreCase: PropTypes.bool,
    autoFocus: PropTypes.bool,
    codeInputStyle: TextInput.propTypes.style,
    containerStyle: viewPropTypes.style,
    onFulfill: PropTypes.func,
    onCodeChange: PropTypes.func,
  };

  static defaultProps = {
    codeLength: 4,
    inputPosition: 'center',
    autoFocus: true,
    size: 40,
    space: padding.small,
    compareWithCode: '',
    ignoreCase: false,
    onCodeChange: () => {},
    onFulfill: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      codeArr: new Array(this.props.codeLength).fill(''),
      currentIndex: 0,
    };

    this.codeInputRefs = [];
  }

  componentDidMount() {
    const { compareWithCode, codeLength, inputPosition } = this.props;
    if (compareWithCode && compareWithCode.length !== codeLength) {
      console.error("Invalid props: compareWith length is not equal to codeLength");
    }

    if (_.indexOf(['center', 'left', 'right', 'full-width'], inputPosition) === -1) {
      console.error('Invalid input position. Must be in: center, left, right, full');
    }
  }

  clear() {
    this.setState({
      codeArr: new Array(this.props.codeLength).fill(''),
      currentIndex: 0
    });
    this._setFocus(0);
  }

  _setFocus(index) {
    this.codeInputRefs[index].focus();
  }

  _blur(index) {
    this.codeInputRefs[index].blur();
  }

  _onFocus(index) {
    let newCodeArr = _.clone(this.state.codeArr);
    const currentEmptyIndex = _.findIndex(newCodeArr, c => !c);
    if (currentEmptyIndex !== -1 && currentEmptyIndex < index) {
      return this._setFocus(currentEmptyIndex);
    }
    for (const i in newCodeArr) {
      if (i >= index) {
        newCodeArr[i] = '';
      }
    }

    this.setState({
      codeArr: newCodeArr,
      currentIndex: index
    })
  }

  _isMatchingCode(code, compareWithCode, ignoreCase = false) {
    if (ignoreCase) {
      return code.toLowerCase() == compareWithCode.toLowerCase();
    }
    return code == compareWithCode;
  }

  _getContainerStyle(size, position) {
    switch (position) {
      case 'left':
        return {
          justifyContent: 'flex-start',
          height: size
        };
      case 'center':
        return {
          justifyContent: 'center',
          height: size
        };
      case 'right':
        return {
          justifyContent: 'flex-end',
          height: size
        };
      default:
        return {
          justifyContent: 'space-between',
          height: size
        }
    }
  }

  _getInputSpaceStyle(space) {
    const { inputPosition } = this.props;
    switch (inputPosition) {
      case 'left':
        return {
          marginRight: space
        };
      case 'center':
        return {
          marginRight: space/2,
          marginLeft: space/2
        };
      case 'right':
        return {
          marginLeft: space
        };
      default:
        return {
          marginRight: 0,
          marginLeft: 0
        };
    }
  }

  _onKeyPress(e) {
    if (e.nativeEvent.key === 'Backspace') {
      const { currentIndex } = this.state;
      let newCodeArr = _.clone(this.state.codeArr);
      const nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;
      for (const i in newCodeArr) {
        if (i >= nextIndex) {
          newCodeArr[i] = '';
        }
      }
      this.props.onCodeChange(newCodeArr.join(''))
      this._setFocus(nextIndex);
    }
  }

  _onInputCode(character, index) {
    const { codeLength, onFulfill, compareWithCode, ignoreCase, onCodeChange } = this.props;
    let newCodeArr = _.clone(this.state.codeArr);
    let currentIndex = this.state.currentIndex;

    if (character.length === 1) {
      newCodeArr[index] = character;
      if (index == codeLength - 1) {
        const code = newCodeArr.join('');

        if (compareWithCode) {
          const isMatching = this._isMatchingCode(code, compareWithCode, ignoreCase);
          onFulfill(isMatching, code);
          !isMatching && this.clear();
        } else {
          onFulfill(code);
        }
        this._blur(this.state.currentIndex);
      } else {
        currentIndex = currentIndex + 1;
        this._setFocus(currentIndex);
      }
    } else if (character > 1) {
      for (let i = 0; i < newCodeArr; i = i + 1) {
        if (character[i]) {
          newCodeArr[index] = character[i];
          currentIndex = i;
        }
      }
      if (currentIndex == codeLength - 1) {
        const code = newCodeArr.join('');

        if (compareWithCode) {
          const isMatching = this._isMatchingCode(code, compareWithCode, ignoreCase);
          onFulfill(isMatching, code);
          !isMatching && this.clear();
        } else {
          onFulfill(code);
        }
        this._blur(this.state.currentIndex);
      } else {
        currentIndex = currentIndex + 1;
        this._setFocus(currentIndex);
      }
    }
    this.setState(prevState => {
      return {
        codeArr: newCodeArr,
        // currentIndex: prevState.currentIndex + 1
        currentIndex: currentIndex
      };
    }, () => { onCodeChange(newCodeArr.join('')) });
  }

  render() {
    const {
      codeLength,
      codeInputStyle,
      containerStyle,
      inputPosition,
      autoFocus,
      space,
      size,
      theme,
    } = this.props;

    const initialCodeInputStyle = {
      width: size,
      height: size
    };
    let codeInputs = [];
    for (let i = 0; i < codeLength; i++) {
      const id = i;
      codeInputs.push(
        <TextInput
          key={id}
          ref={ref => (this.codeInputRefs[id] = ref)}
          style={[
            styles.codeInput(theme),
            this._getInputSpaceStyle(space),
            initialCodeInputStyle,
            codeInputStyle
          ]}
          keyboardType={'numeric'}
          returnKeyType={'done'}
          {...this.props}
          autoFocus={autoFocus && id == 0}
          onFocus={() => this._onFocus(id)}
          value={this.state.codeArr[id] ? this.state.codeArr[id].toString() : ''}
          onChangeText={text => this._onInputCode(text, id)}
          onKeyPress={(e) => this._onKeyPress(e)}
          maxLength={1}
        />
      )
    }

    return (
      <View style={[styles.container, this._getContainerStyle(size, inputPosition), containerStyle]}>
        {codeInputs}
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  codeInput: theme => ({
    backgroundColor: theme.colors.border,
    color: theme.colors.primary,
    textAlign: 'center',
    padding: 0,
    fontSize: sizes.h3,
    borderRadius: borderRadius.base,
    ...fonts.medium,
  }),
};

export default withTheme(InputCode);
