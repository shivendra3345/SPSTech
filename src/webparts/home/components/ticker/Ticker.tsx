import * as React from 'react';
import styles from './Ticker.module.scss';
import { ITickerProps } from './ITickerProps';
import { IItemObj, ITickerState } from './ITickerState';
import { escape } from '@microsoft/sp-lodash-subset';
import Slider from "react-slick";
import Modal from 'react-modal';
import { SPComponentLoader } from '@microsoft/sp-loader';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ItemsService } from "../../../../services/spservices"
import { Icon } from 'office-ui-fabric-react/lib/Icon';

export default class Home extends React.Component<ITickerProps, ITickerState> {
    private itemService: ItemsService = null;
    public constructor(props: ITickerProps, state: ITickerState) {
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

    private CustomNextArrow = (props) => {
        const { onClick } = props;
        return <div style={{ display: this.state.isHovered ? "block" : "block" }} className={`${styles['custom-arrow']} ${styles['custom-next-arrow']}`} onClick={onClick}><Icon iconName='ChevronRight' /></div>;
    };

    private CustomPrevArrow = (props) => {
        const { onClick } = props;
        return <div style={{ display: this.state.isHovered ? "block" : "block" }} className={`${styles['custom-arrow']} ${styles['custom-prev-arrow']}`} onClick={onClick}> <Icon iconName='ChevronLeft' /></div>;
    };

    public componentDidMount(): void {
        this.itemService._getTicker().then((data) => {
            this.setState({ items: data })
        });

    }
    public render(): React.ReactElement<ITickerProps> {
        const {
            title,
        } = this.props;
        let settings: any = this.itemService.slickCarouselSettings();
        settings.nextArrow = <this.CustomNextArrow />;
        settings.prevArrow = <this.CustomPrevArrow />;
        settings.slidesToShow = 1;
        settings.autoplay = true;
        settings.infinite = true;
        settings.slidesToScroll = 1;
        return (
            <div className={styles['ticker-wrapper']}>
                <div  className={styles['ticker-wrapper-label']} >
                    <h3>ANNOUNCEMENT</h3>
                </div>
                <div  className={styles['ticker-wrapper-slider']} >
                    <div  className={styles['ticker-wrapper-slider-content']}>
                    <Slider  {...settings}>
                        {this.state.items && this.state.items.length > 0 && this.state.items.map((card, index) => (
                            <div key={index} className={styles['card-container']}>
                                <div className={styles['card-content']} >
                                    <span className={styles['card-title']}>{card.description}</span>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
                </div>
            </div>
        );
    }
}
