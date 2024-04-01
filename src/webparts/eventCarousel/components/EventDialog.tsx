
import * as React from 'react';
import  { Component } from 'react';
import styles from './EventCarousel.module.scss';
import { ItemsService } from '../../../services/spservices';
import { WebPartContext } from '@microsoft/sp-webpart-base';

interface IEventData {
  title: string;
  Description: string;
  EventDate: any; // Assuming a string format for simplicity, adjust as needed
  EndDate: any;   // Assuming a string format for simplicity, adjust as needed
}

interface EventDialogProps {
  onClose: () => void;
  eventData: IEventData;
  context :WebPartContext;
}

class EventDialogComponent extends Component<EventDialogProps> {
  private itemService: ItemsService = null;
  
  render() {
    const { onClose, eventData } = this.props;
    this.itemService = new ItemsService(this.props.context)
    return (
        <div className={styles['dialog-container']}>
        <div className={styles['dialog-header']}>
          <h2>{eventData.title}</h2>
          <button className={styles['close-button']} onClick={onClose}>&times;</button>
        </div>
        <div className={styles['dialog-content']}>
          <p dangerouslySetInnerHTML={{ __html: eventData.Description }}></p>
          <p>Start Date: {this.itemService.formatDateTime(eventData.EventDate.toString())}</p>
          <p>End Date: {this.itemService.formatDateTime(eventData.EndDate.toString())}</p>
        </div>
        <div className={styles['dialog-footer']}>
          <button className={styles['close-button']} onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }
}

export default EventDialogComponent;
