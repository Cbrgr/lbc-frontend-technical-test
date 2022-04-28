import { FC, useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Logo from '../assets/lbc-logo.webp'
import styles from '../styles/Home.module.css'
import { getLoggedUserId } from '../utils/getLoggedUserId'
import ConversationsList from '../components/ConversationsList'

const Home: FC = () => {
	

	return (
		<div className={styles['container']}>
			<ConversationsList/>
		</div>
	)
}

export default Home