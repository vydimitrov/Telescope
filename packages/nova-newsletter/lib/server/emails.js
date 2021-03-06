import NovaEmail from 'meteor/nova:email';
import Newsletter from "../namespace.js";
import { getSetting } from 'meteor/nova:core';

// Extend email objects with server-only properties

NovaEmail.emails.newsletter = {

  ...NovaEmail.emails.newsletter, 

  getNewsletter() {
    return Newsletter.build(Newsletter.getPosts(getSetting('postsPerNewsletter', 5)));
  },

  subject() {
    return this.getNewsletter().subject;
  },

  getTestHTML() {
    var campaign = this.getNewsletter();
    var newsletterEnabled = '<div class="newsletter-enabled"><strong>Newsletter Enabled:</strong> '+getSetting('enableNewsletter', true)+'</div>';
    var mailChimpAPIKey = '<div class="mailChimpAPIKey"><strong>mailChimpAPIKey:</strong> '+(typeof getSetting('mailChimpAPIKey') !== "undefined")+'</div>';
    var mailChimpListId = '<div class="mailChimpListId"><strong>mailChimpListId:</strong> '+(typeof getSetting('mailChimpListId') !== "undefined")+'</div>';
    var campaignSubject = '<div class="campaign-subject"><strong>Subject:</strong> '+campaign.subject+' (note: contents might change)</div>';
    var campaignSchedule = '<div class="campaign-schedule"><strong>Scheduled for:</strong> '+ Meteor.call('getNextJob') +'</div>';
    return newsletterEnabled+mailChimpAPIKey+mailChimpListId+campaignSubject+campaignSchedule+campaign.html;
  }

};

NovaEmail.emails.newsletterConfirmation = {

  ...NovaEmail.emails.newsletterConfirmation, 

  getTestHTML() {
    return NovaEmail.getTemplate('newsletterConfirmation')({
      time: 'January 1st, 1901',
      newsletterLink: 'http://example.com',
      subject: 'Lorem ipsum dolor sit amet'
    });
  }

};