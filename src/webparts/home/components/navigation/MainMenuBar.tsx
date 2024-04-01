
import * as React from 'react';
import { Component } from 'react';
import MenuItem from './MenuItem';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import styles from './navigation.module.scss';

import { ItemsService } from "../../../../services/spservices"
interface Menu {
    id: number;
    title: string;
    category: string,
    link:string,
    order:number,
    subMenuItems?: {
        id: number;
        title: string;
        link:string,
        category: string,
        order:number

    }[];
}

interface MainMenuBarProps {
    menuItems: Menu[];
    context: WebPartContext
}

interface MainMenuBarState {
    menuItems: Menu[];
}
class MainMenuBar extends Component<MainMenuBarProps, MainMenuBarState> {
    private itemService: ItemsService = null;

    public constructor(props: MainMenuBarProps, state: MainMenuBarState) {
        super(props);
        this.state = {
            menuItems: []
        }
        this.itemService = new ItemsService(this.props.context)
    }

    public componentDidMount(): void {
        this.itemService._GetNav().then((data) => {
            this.setState({ menuItems: data });
        });
    }

    render() {
        const { menuItems } = this.props;
        return (
            <div className={`${styles['main-menu']}`}>
                {this.state.menuItems.map(item => (
                    <MenuItem key={item.id} item={item} />
                ))}
            </div>
        );
    }
}

export default MainMenuBar;
