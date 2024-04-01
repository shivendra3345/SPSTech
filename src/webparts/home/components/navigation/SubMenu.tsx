// SubMenu.tsx

import * as React from 'react';
import { Component } from 'react';

import styles from './navigation.module.scss';


interface MenuItem {
  id: number;
  title: string;
  order:number;
  link:string;
  category:string;
  subMenuItems?: MenuItem[];
}

interface SubMenuProps {
  subMenuItems: MenuItem[];
  isHovered: boolean;
}

interface SubMenuState {
  isHovered: boolean;
}

class SubMenu extends Component<SubMenuProps, SubMenuState> {
  constructor(props: SubMenuProps) {
    super(props);
    this.state = {
      isHovered: false
    };
  }

  static getDerivedStateFromProps(props: SubMenuProps, state: SubMenuState) {
    // If the menu is currently hovered or its children are hovered, show the sub-menu
    if (props.isHovered || state.isHovered) {
      return { isHovered: true };
    }
    return null;
  }

  handleMouseEnter = () => {
    this.setState({ isHovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ isHovered: false });
  };


  render() {
    const { subMenuItems } = this.props;
     
    const { isHovered } = this.state;

    return (
      <ul
      className={`${styles['sub-menu']}`}
      
      
    >
      {subMenuItems.map(item => (
        <li key={item.id}
        
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}

        
        >
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
          {item.subMenuItems && (

            
            <SubMenu subMenuItems={item.subMenuItems} isHovered={isHovered}
            
            
            />
          )}
        </li>
      ))}
    </ul>
    );
  }
}

export default SubMenu;
