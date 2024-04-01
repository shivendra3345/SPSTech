import * as React from 'react';
import styles from './People.module.scss';
import { IPeopleProps } from './IPeopleProps';
import { IPeopleItemObj, IPeopleState } from './IPeopleStates';
import { escape } from '@microsoft/sp-lodash-subset';
 
import { SPComponentLoader } from '@microsoft/sp-loader';
 
import { ItemsService } from "../../../../services/spservices"
import { Icon } from 'office-ui-fabric-react/lib/Icon';

export default class Home extends React.Component<IPeopleProps, IPeopleState> {
    private itemService: ItemsService = null;
    public constructor(props: IPeopleProps, state: IPeopleState) {
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
        this.itemService._getPeople().then((data) => {
            this.setState({ items: data })
        });

    }
    public render(): React.ReactElement<IPeopleProps> {
        const {
            title,
            slidesCount
        } = this.props;
       
        return (
            <div className={styles['tab-wrapper']}>
                <div className="ms-Grid" style={{width:'100%'}}>
                    <div className="ms-Grid-row" >
                        <div className='ms-Grid'><h3>{title}</h3></div>
                    </div>
                    <div className="ms-Grid-row" >
                        <div>
                            {/*  className={styles['tab-wrapper-slider']} */}
                            <div className={styles['tab-wrapper-slider-content']}>

                                {this.state.items && this.state.items.length > 0 && this.state.items.map((card, index) => (
                                     <div className={styles['card-content']} >
                                        <div>
                                        <p className={styles['profile-container']}>
                                            <img className={styles['profile-img']} src={`${this.props.context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?UserName=${card.email}&size=s`} draggable="false" /> 
                                        </p>
                                        </div>
                                        <div style={{display:"grid", marginLeft:"10px"}}>
                                            <span className={styles['profile-title']}>{card.name}</span>
                                            <span className={styles['profile-job-title']}>{card.jobtitle}</span>
                                        </div>
                                     </div> 
                               ))}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
