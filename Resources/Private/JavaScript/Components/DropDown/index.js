import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import enhanceWithClickOutside from 'react-click-outside';
import {executeCallback} from 'Shared/Utilities/index';
import Icon from 'Components/Icon/index';
import style from './style.css';

export class DropDown extends Component {
    static propTypes = {
        className: PropTypes.string,
        isOpened: PropTypes.bool.isRequired,
        children: PropTypes.node.isRequired
    };

    static defaultProps = {
        isOpened: false
    };

    static childContextTypes = {
        isOpened: PropTypes.bool.isRequired,
        toggleDropDown: PropTypes.func.isRequired,
        closeDropDown: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.state = {isOpened: false};
    }

    getChildContext() {
        return {
            isOpened: this.state.isOpened,
            toggleDropDown: () => this.toggle(),
            closeDropDown: () => this.close()
        };
    }

    render() {
        const {children, className, ...directProps} = this.props;
        const dropDownClassName = mergeClassNames({
            [className]: className && className.length,
            [style.dropDown]: true
        });

        return (
            <div className={dropDownClassName} {...directProps}>
                {children}
            </div>
        );
    }

    handleClickOutside() {
        this.close();
    }

    close() {
        this.setState({isOpened: false});
    }

    toggle() {
        this.setState({isOpened: !this.state.isOpened});
    }
}

export class Header extends Component {
    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.node
    };
    static contextTypes = {
        isOpened: PropTypes.bool.isRequired,
        toggleDropDown: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        const {className, children, ...directProps} = this.props;
        const {isOpened, toggleDropDown} = this.context;
        const classNames = mergeClassNames({
            [style.dropDown__btn]: true,
            [className]: className && className.length
        });
        const chevron = this.renderChevronIcon();

        return (
            <button
                onClick={e => executeCallback({e, cb: () => toggleDropDown()})}
                ref={btn => {
                    const method = isOpened ? 'focus' : 'blur';

                    // Initially focus the btn if the propType was set.
                    if (btn !== null) {
                        btn[method]();
                    }
                }}
                className={classNames}
                aria-haspopup="true"
                {...directProps}
                >
                {children}
                {chevron}
            </button>
        );
    }

    renderChevronIcon() {
        const {isOpened} = this.context;
        const iconName = isOpened ? 'chevron-up' : 'chevron-down';

        return <Icon icon={iconName} className={style.dropDown__chevron} />;
    }
}

export class Contents extends Component {
    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.node.isRequired
    };

    static contextTypes = {
        isOpened: PropTypes.bool.isRequired,
        closeDropDown: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        const {className, children, ...directProps} = this.props;
        const {isOpened, closeDropDown} = this.context;
        const contentsClassName = mergeClassNames({
            [className]: className && className.length,
            [style.dropDown__contents]: true,
            [style['dropDown__contents--isOpen']]: isOpened
        });
        const ariaIsHiddenLabel = isOpened ? 'false' : 'true';

        return (
            <ul
                className={contentsClassName}
                aria-hidden={ariaIsHiddenLabel}
                aria-label="dropdown"
                {...directProps}
                onClick={() => closeDropDown()}
                >
                {children}
            </ul>
        );
    }
}

//
// Add the click-outside functionality to the DropDown component.
//
const EnhancedDropDown = enhanceWithClickOutside(DropDown);

//
// Assign the Child Component to the parent,
// to replicate the structure of a `DropDown` Component.
//
EnhancedDropDown.Header = Header;
EnhancedDropDown.Contents = Contents;

export default EnhancedDropDown;
