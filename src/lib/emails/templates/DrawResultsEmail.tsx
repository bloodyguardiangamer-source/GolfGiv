import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Heading, Hr } from '@react-email/components';

interface DrawResultsEmailProps {
  firstName: string;
  drawDate: string;
  winningNumbers: number[];
  matches: number;
  prizeWon: number;
}

export const DrawResultsEmail: React.FC<Readonly<DrawResultsEmailProps>> = ({ firstName, drawDate, winningNumbers, matches, prizeWon }) => (
  <Html>
    <Head />
    <Preview>The results for the {drawDate} draw are in!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>Draw Results 🎯</Heading>
        </Section>
        <Section style={content}>
          <Text style={text}>Hi {firstName},</Text>
          <Text style={text}>
            The winning numbers for the <strong>{drawDate}</strong> draw have been published:
          </Text>
          
          <Section style={numbersContainer}>
            <Text style={numbersText}>{winningNumbers.join(' - ')}</Text>
          </Section>

          <Text style={text}>
            You matched <strong>{matches}</strong> numbers.
          </Text>
          
          {prizeWon > 0 ? (
            <Text style={winnerText}>
              Congratulations! You won <strong>£{prizeWon.toLocaleString()}</strong>!
            </Text>
          ) : (
            <Text style={text}>
              Unfortunately, you didn't win a prize this time. Better luck next month! Keep your scores coming.
            </Text>
          )}

          <Hr style={hr} />
          <Text style={footer}>GolfGive &copy; {new Date().getFullYear()}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = { backgroundColor: '#0a0a14', fontFamily: 'sans-serif' };
const container = { margin: '0 auto', padding: '20px 0 48px', width: '580px' };
const header = { padding: '32px', backgroundColor: '#111120', borderRadius: '8px 8px 0 0', textAlign: 'center' as const };
const h1 = { color: '#97ff2a', fontSize: '24px', margin: '0' };
const content = { padding: '32px', backgroundColor: '#1c1c30', borderRadius: '0 0 8px 8px' };
const text = { color: '#ffffff', fontSize: '16px', lineHeight: '24px' };
const winnerText = { color: '#f5c842', fontSize: '18px', fontWeight: 'bold', lineHeight: '24px' };
const numbersContainer = { backgroundColor: '#111120', padding: '20px', borderRadius: '8px', margin: '20px 0', textAlign: 'center' as const };
const numbersText = { color: '#97ff2a', fontSize: '24px', letterSpacing: '4px', margin: '0', fontWeight: 'bold' };
const hr = { borderColor: '#2c2c48', margin: '20px 0' };
const footer = { color: '#888888', fontSize: '12px', textAlign: 'center' as const };
