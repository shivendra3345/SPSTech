
import * as React from 'react';
import { Component } from 'react';
import SubMenu from './SubMenu';

import styles from './navigation.module.scss';
interface MenuItemProps {
  item: {
    id: number;
    title: string;
    order:number;
    link:string;
    category:string;

    subMenuItems?: {
      id: number;
      title: string;
      order:number;
      link:string;
      category:string; 
    }[];
  };
}

interface MenuItemState {
  showSubMenu: boolean;
}

class MenuItem extends Component<MenuItemProps, MenuItemState> {
  constructor(props: MenuItemProps) {
    super(props);
    this.state = {
      showSubMenu: false
    };
  }

  toggleSubMenu = () => {
    this.setState(prevState => ({
      showSubMenu: !prevState.showSubMenu
    }));
  };

  render() {
    const { item } = this.props;
    const { showSubMenu } = this.state;

    return (
      <div className={`${styles['menu-item']}`} onClick={this.toggleSubMenu}>
        <div>
          {
            (item.category ==='Link')?
            <a href={item.link}>{item.title}</a>
            :
            <>
            {item.title}
            </>
          }
          </div>
        {showSubMenu && <SubMenu subMenuItems={item.subMenuItems} isHovered={true}/>}
      </div>
    );
  }
}

export default MenuItem;
