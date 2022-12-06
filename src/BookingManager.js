// ¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤
// ¤¤ This file handles the functionallity needed ¤¤
// ¤¤ for the session booking form.               ¤¤
// ¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤

// Booking configuration
const timeAheadAllowed = 14;  // The maximum number of days ahead of today, that a customer can book a session
const firstAvailableTime = 8; // The first hour in a day that a session can begin
const lastAvailableTime = 20; // The last hour in a day that a session can begin
const sessionLength = 2;      // The length (in hours) of each session

// Court configuration
const outdoorCourts = ["Bana A1", "Bana A2", "Bana A3", "Bana A4", "Bana B1", "Bana B2", "Bana C1"];
const indoorCourts = ["Bana I1", "Bana I2", "Bana I3", "Bana I4"];

// Debug configuration
const debugBookingSystem = true;  // Set to true in order to print debug-related information to the console

// #############
// ## Classes ##
// #############

export default class BookingManager {
  #bookings = new Array();
  #history = new Array();
  #sessions = new Array();

  constructor() {

  }

  book(date, customer, indoors, changeroomMens, changeroomWomens, sauna) {
    // Reset the minutes and seconds of the date
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    // Try to find an entry in bookings that has the date of the specified date
    let booking;
    this.#bookings.forEach(current => {
      // Note: Using .toLocaleDateString() in order to exclude the time
      if (current.getDate().toLocaleDateString() === date.toLocaleDateString()) {
        if (debugBookingSystem) console.log(`[BookingManager.book()] Found an excisting entry on this day (${date.toLocaleDateString()}).`);
        booking = current;
        return;
      }
    });

    // Create a new BookingDay if none was found above
    if (booking === undefined) {
      if (debugBookingSystem) console.log(`[BookingManager.book()] Created a new entry for this day (${date.toLocaleDateString()}).`);
      booking = new BookingDay(date);
      // Add the booking to the bookings array then sort it
      this.#bookings.push(booking);
      this.#bookings = this.#bookings.sort((a, b) => {return (a.getDate() < b.getDate()) ? -1 : (a.getDate() > b.getDate()) ? 1 : 0});
    }

    let court = booking.canBook(date, indoors);
    if (court !== null) {

      // Create a new session object and assign that session to the court
      let session = new Session(customer, date, changeroomMens, changeroomWomens, sauna, court);
      court.setSession(session);

      // Add the session to the BookingDay
      booking.getSessions().push(session);

      // Append this session to the session array
      this.#sessions.push(session);

      if (debugBookingSystem) {
        console.log(`[BookingManager.book()] Booked a new session at ${court.getSession().getDate().toLocaleTimeString().slice(0, 5)}:`);
        console.log(court);
      }
      return true;
    }

    if (debugBookingSystem) console.log(`[BookingManager.book()] There was no available court on this day and time (${date.toLocaleString().slice(0, 16)}).`);
    return false;
  }

  populate() {
    // This function is for testing purposes only

    let customer = new Customer("Dennis", "Hankvist", "n@h.c", null, null);
    let numberOfBookings = 3 + this.#randomNumber(7);
    
    // Populate this manager with a random (from 3 to 10) amount of bookings
    let bookCount = 0;
    for (let i = 0; i < numberOfBookings; i++) {
        if (this.book(this.#randomDate(), customer, this.#randomBool())) bookCount++;
    }

    if (debugBookingSystem) {
        console.log(`[BookingManager.populate()] Booked ${bookCount}/${numberOfBookings} sessions for ${customer.firstName} ${customer.lastName}:`)
        console.log(this);
    }
  }

  getDays() {
    return this.#bookings;
  }

  // Private testing functions below

  #randomNumber(max) {
    return Number.parseInt(Math.random() * (max + 1))
  }

  #randomDate() {
    let result = new Date();

    let time = sessionLength * this.#randomNumber(((lastAvailableTime - firstAvailableTime) / 2));

    result.setDate(result.getDate() + this.#randomNumber(6));
    result.setHours(firstAvailableTime + time);
    return result;
  }

  #randomBool() {
    return Math.random() <= 0.5;
  }

  // End private testing methods

}

class BookingDay {
  #date;
  #times = new Array();
  #sessions = new Array();

  constructor(date) {
    this.#date = new Date(new Date(date.toDateString())); // Leave out time

    // Create an array (representing the time of a session) that consists of
    // arrays of Court for indoor courts and outdoor courts
    for (let i = firstAvailableTime; i <= lastAvailableTime; i += sessionLength) {
      let indoors = new Array();
      let outdoors = new Array();

      indoorCourts.forEach(court => {
        indoors.push(new Court(court, null, true))
      });
  
      outdoorCourts.forEach(court => {
        outdoors.push(new Court(court, null, false))
      });

      this.#times.push({time: i, indoorCourts: indoors, outdoorCourts: outdoors})      
    }

  }

  getDate() {
    return this.#date;
  }

  canBook(dateTime, indoors) {
    // Check if a customer can book a session on this day and time
    // Returns the first available court that is encountered, or null
    // if none is available

    // Get the time entry for this date
    let time;
    for (let i = 0; i < this.#times.length; i++) {
      const current = this.#times[i];
      if (current.time === dateTime.getHours()) {
        time = current;
        break; // Break out of the loop
      }
    }

    // Check for errors
    if (time == null) {
      if (debugBookingSystem) console.log(`[BookingDay.canBook()] Error: Could not find a session at the time of '${dateTime.getHours()}'.`);
      return null; // Exit the method
    }

    // Loop trough all indoor or outdoor courts and see if any of them is available to book
    let courts = indoors ? time.indoorCourts : time.outdoorCourts;

    for (let i = 0; i < courts.length; i++) {
      const court = courts[i];
      if (court.isAvailable()) return court;
    }

    // Return null if the excecution reaches here
    return null;
  }

  cancel() {
    // May not be placed here
  }

  getTimes() {
    return this.#times;
  }

  getSessions() {
    return this.#sessions;
  }

}

class Court {
  #name;
  #session = null;
  #indoors;

  constructor(name, assignedTo, indoors) {
    this.#name = name;
    this.#session = assignedTo;
    this.#indoors = indoors;
  }

  getName() {
    return this.#name;
  }

  getIndoors() {
    return this.#indoors;
  }

  getSession() {
    return this.#session;
  }

  setSession(session) {
    this.#session = session;
  }

  isBooked() {
    return this.#session !== null;
  }

  isAvailable() {
    return !this.isBooked();
  }

}

class Session {
  #date;
  #court;

  constructor(customer, date, changeroomMens, changeroomWomens, sauna, court) {
    this.customer = customer;
    this.#date = date;
    this.changeroomMens = changeroomMens;
    this.changeroomWomens = changeroomWomens;
    this.sauna = sauna;
    this.#court = court;
  }

  getDate() {
    return this.#date;
  }

  getCourt() {
    return this.#court;
  }

}

class Customer {
  constructor(firstName, lastName, email, phone, memberID) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.memberID = memberID;
  }
}