import * as React from 'react';
import styles from './QuickLinks.module.scss';
import { IQuickLinksProps } from './IQuickLinksProps';
import { IItemObj, IQuickLinksState } from './IQuickLinksStates';
import { escape } from '@microsoft/sp-lodash-subset';
 
import { SPComponentLoader } from '@microsoft/sp-loader';
 
import { ItemsService } from "../../../../services/spservices"
import { Icon } from 'office-ui-fabric-react/lib/Icon';
 

export default class Home extends React.Component<IQuickLinksProps, IQuickLinksState> {
    private itemService: ItemsService = null;
    public constructor(props: IQuickLinksProps, state: IQuickLinksState) {
        super(props);
        this.state = {
            Title: "",
            ID: 0,
            items: [],
            carouselRef: null,
            isLoading: false,
            isHovered: true
        };

        this.itemService = new ItemsService(this.props.context)

    }

    

    public componentDidMount(): void {
        this.itemService._getQuickLinks().then((data) => {
            this.setState({ items: data })
        });

    }
    public render(): React.ReactElement<IQuickLinksProps> {
        const {
            title,
            slidesCount
        } = this.props;
       
        return (
            <>
            <div className={styles['tab-wrapper']}>
                <div className="ms-Grid" style={{width:'100%'}}>
                    <div className="ms-Grid-row" >
                        <div className='ms-Grid'><h3>Quick Links</h3></div>
                    </div>
                    <div className="ms-Grid-row" >
                        <div>
                            {/*  className={styles['tab-wrapper-slider']} */}
                            <div className={styles['tab-wrapper-slider-content']}>

                                {this.state.items && this.state.items.length > 0 && this.state.items.map((card, index) => (
                                     <div className={styles['card-content']} >
                                            <a href={card.description} className={styles['card-title']}>{card.title}</a>
                                     </div> 
                               ))}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            </>


        );
    }
}
