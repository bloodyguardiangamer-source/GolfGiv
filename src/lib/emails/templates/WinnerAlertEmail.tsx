import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Heading, Hr, Button } from '@react-email/components';

interface WinnerAlertEmailProps {
  firstName: string;
  prizeWon: number;
  winId: string;
}

export const WinnerAlertEmail: React.FC<Readonly<WinnerAlertEmailProps>> = ({ firstName, prizeWon, winId }) => (
  <Html>
    <Head />
    <Preview>Action Required: Claim your £{prizeWon.toLocaleString()} GolfGive Prize!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>🏆 YOU WON! 🏆</Heading>
        </Section>
        <Section style={content}>
          <Text style={text}>Congratulations {firstName}!</Text>
          <Text style={text}>
            You matched the winning numbers and have won <strong>£{prizeWon.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong> in our latest draw.
          </Text>
          <Text style={text}>
            To claim your prize, we need to verify your scores. Please upload a photo of your scorecard or a screenshot of your official golf handicap app.
          </Text>
          
          <Section style={btnContainer}>
            <Button style={button} href={`https://golfgive.com/dashboard?upload=${winId}`}>
              Upload Proof to Claim
            </Button>
          </Section>

          <Text style={subtext}>
            You must upload your proof within 14 days of the draw date to claim your prize.
          </Text>

          <Hr style={hr} />
          <Text style={footer}>GolfGive &copy; {new Date().getFullYear()}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = { backgroundColor: '#0a0a14', fontFamily: 'sans-serif' };
const container = { margin: '0 auto', padding: '20px 0 48px', width: '580px' };
const header = { padding: '32px', backgroundColor: '#f5c842', borderRadius: '8px 8px 0 0', textAlign: 'center' as const };
const h1 = { color: '#0a0a14', fontSize: '28px', margin: '0' };
const content = { padding: '32px', backgroundColor: '#1c1c30', borderRadius: '0 0 8px 8px' };
const text = { color: '#ffffff', fontSize: '16px', lineHeight: '24px', marginBottom: '16px' };
const subtext = { color: '#ff6b6b', fontSize: '14px', fontStyle: 'italic', marginTop: '24px' };
const btnContainer = { textAlign: 'center' as const, marginTop: '32px', marginBottom: '32px' };
const button = { backgroundColor: '#97ff2a', borderRadius: '4px', color: '#0a0a14', fontSize: '16px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' as const, display: 'block', padding: '16px' };
const hr = { borderColor: '#2c2c48', margin: '20px 0' };
const footer = { color: '#888888', fontSize: '12px', textAlign: 'center' as const };
