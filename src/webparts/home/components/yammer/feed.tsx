import * as React from 'react';
import styles from './Feed.module.scss';
import { IFeedProps } from './IFeedProps';
import { IFeedItemObj, IFeedState } from './IFeedStates';
import { escape } from '@microsoft/sp-lodash-subset';
 
import { SPComponentLoader } from '@microsoft/sp-loader';
 
import { ItemsService } from "../../../../services/spservices"
import { Icon } from 'office-ui-fabric-react/lib/Icon';

export default class Home extends React.Component<IFeedProps, IFeedState> {
    private itemService: ItemsService = null;
    public constructor(props: IFeedProps, state: IFeedState) {
        super(props);
        
    }

     
    public render(): React.ReactElement<IFeedProps> {
        const {
            title,
            yammerlink
        } = this.props;
        
        return (
            <div className={styles['tab-wrapper']}>
                <div className="ms-Grid" style={{width:'100%'}}>
                     <iframe name="embed-feed" title="Viva Engage" 
                     src={yammerlink}
                      style={{border: '0px', overflow: 'hidden', width: '100%', height: '676px'}}></iframe> 
                 </div>
            </div>
        );
    }
}
