import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-view-work-day',
  templateUrl: './view-work-day.component.html',
  styleUrls: ['./view-work-day.component.scss']
})
export class ViewWorkDayComponent implements OnInit {
  
  // Array to hold the event data
  calendarEvents = [
    { id: '1', title: 'event 1', description: 'Event 1 description', date: '2024-11-01', backgroundColor: '#ff0000', borderColor: '#ff0000' },
    { id: '2', title: 'Ulang tahun', description: 'Birthday event', date: '2024-10-02', backgroundColor: '#0000ff', borderColor: '#0000ff' }
  ];
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: this.calendarEvents,
    eventClick: (arg) => this.deleteEvent(arg.event.id), // Handle event clicks for deleting
    eventContent: this.renderEventContent // Custom render function to show title and description
  };

  handleDateClick(arg) {
    const title = prompt('Enter event title:');  // Prompt user for event title
    if (title) {
      const description = prompt('Enter event description:');  // Prompt user for event description
      const color = prompt('Enter event color (e.g. #ff0000):') || '#00ff00';  // Default color if none provided
      this.addNewEvent(title, description, arg.dateStr, color);
    }
  }

  // Handle adding a new event manually
  addNewEvent(eventTitle: string, eventDescription: string, eventDate: string, eventColor: string) {
    const newEventId = (this.calendarEvents.length + 1).toString(); // Generate a new ID for the event
    const newEvent = {
      id: newEventId,
      title: eventTitle,
      description: eventDescription, // Store event description
      date: eventDate,
      backgroundColor: eventColor,
      borderColor: eventColor
    };
    this.calendarEvents = [...this.calendarEvents, newEvent]; // Add event to the array
    this.calendarOptions.events = this.calendarEvents; // Update FullCalendar
    alert(`Event "${eventTitle}" added on ${eventDate}`);
  }

  // Method to delete an event by ID
  deleteEvent(eventId: string) {
    this.calendarEvents = this.calendarEvents.filter(event => event.id !== eventId); // Remove event by ID
    this.calendarOptions.events = this.calendarEvents; // Update calendar
    alert('Event deleted');
  }

  // Custom render function to display both title and description
  renderEventContent(eventInfo) {
    return {
      html: `
        <div class="fc-event-title">${eventInfo.event.title}</div>
        <div class="fc-event-description">${eventInfo.event.extendedProps.description}</div>
      `
    };
  }

  constructor() { }

  ngOnInit(): void { }
}
