import React from 'react';
import classnames from 'classnames';
import warning from 'warning';

export type DialTriggerType = 'click' | 'hover';

export type DialPlacementType = 'left' | 'right' | 'bottom' | 'top';

export interface DialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    actions?: React.ReactNode[];
    prefixCls?: string;
    trigger?: DialTriggerType;
    maskable?: boolean;
    placement?: DialPlacementType;
}

interface DialButtonState {
    actionsVisible?: boolean;
}

class DialButton extends React.PureComponent<DialButtonProps, DialButtonState> {
    static defaultProps: DialButtonProps = {
        trigger: 'click',
        maskable: false,
        placement: 'left',
    }

    state: DialButtonState = {
        actionsVisible: false,
    }

    private handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { trigger, onClick } = this.props;
        if (trigger === 'click') {
            this.setState((prevState: DialButtonState) => ({
                actionsVisible: !prevState.actionsVisible,
            }), () => {
                if (onClick) {
                    onClick(event);
                }
            });
        } else {
            if (this.state.actionsVisible) {
                this.setState({
                    actionsVisible: false,
                }, () => {
                    if (onClick) {
                        onClick(event);
                    }
                });
            }
        }
    }

    private handleMouseOut = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (this.state.actionsVisible) {
            const { onMouseOut } = this.props;
            this.setState({
                actionsVisible: false,
            }, () => {
                if (onMouseOut) {
                    onMouseOut(event);
                }
            });
        }
    }

    private handleMouseEnter = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (!this.state.actionsVisible) {
            const { onMouseEnter } = this.props;
            this.setState({
                actionsVisible: true,
            }, () => {
                if (onMouseEnter) {
                    onMouseEnter(event);
                }
            });
        }
    }

    render() {
        const {
            children,
            prefixCls,
            className,
            actions,
            trigger,
            placement,
            onClick,
            onMouseEnter,
            onMouseOut,
            ...other
        } = this.props;
        const classname = classnames(prefixCls, 'dial-button', {
            'placement-left': placement === 'left',
            'placement-right': placement === 'right',
            'placement-bottom': placement === 'bottom',
            'placement-top': placement === 'top',
        }, className);
        warning(!children || !actions, 'You must have either children or actions.')
        return (
            <button
                className={classname}
                onClick={this.handleClick}
                onMouseOut={trigger === 'hover' ? this.handleMouseOut : onMouseOut}
                onMouseEnter={trigger === 'hover' ? this.handleMouseEnter : onMouseEnter}
                {...other}
            >
                {children}
            </button>
        );
    }
}

export default DialButton;
