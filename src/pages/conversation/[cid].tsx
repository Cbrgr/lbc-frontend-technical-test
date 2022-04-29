import { createRef, FC, useEffect, useState } from 'react'

import styles from '../../styles/Conversation.module.css'
import { getLoggedUserId } from '../../utils/getLoggedUserId'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link';

const Conversation: FC = () => {
	const router = useRouter()
    const convId = router?.query?.cid
    
	const [messages, setMessages] = useState(null)
	const [isMsgLoading, setMsgLoading] = useState(false)
	const [isConvLoading, setConvLoading] = useState(false)
	const [user, setUser] = useState(null)
    const selfId = getLoggedUserId()

    const inputRef = createRef<any>()

    
    useEffect(() => {
		setConvLoading(true)
		fetch('http://localhost:3005/conversations/' + selfId)
		.then((res) => res.json())
		.then((data) => {
            const currentConv = data.filter((c: any) => c.id == convId)[0]
            const userId = (selfId == currentConv.recipientId) ? currentConv.senderId : currentConv.recipientId
            const userNickname = (selfId == currentConv.recipientId) ? currentConv.senderNickname : currentConv.recipientNickname
            setUser({'id': userId, 'name': userNickname})
            setConvLoading(false)
		})
    }, [])

	useEffect(() => {
		setMsgLoading(true)
		getMessages()
    }, [])

    const getMessages = () => {
        fetch('http://localhost:3005/messages/' + convId)
		.then((res) => res.json())
		.then((data) => {
            setMessages(data)
            setMsgLoading(false)
		})
    }
    
    const sendMessage = (message) => {
        if (message === '') {return false}
        const data = {
            'conversationId': convId,
            'timestamp': Date.now(),
            'authorId': selfId,
            'body': message,
        }

		fetch('http://localhost:3005/messages/' + convId, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
		.then((res) => res.json())
		.then((data) => {
            if (typeof data.id !== undefined) {
                getMessages()
                if (inputRef.current) {
                    inputRef.current.value = ''
                }
            }
        })
        
    }

	return (
		<div className={styles['conversation']}>
            <div className={styles['conversation__heading']}>
                {isConvLoading ? (
                    <div className="loader">loading</div>
                ) : (
                    <div className={styles['conversation__heading-content']}>
                        <Link
                            href={{
                                pathname: '/'
                            }}
                        >
                            <div className={styles['conversation__heading-back']}>❮</div>
                        </Link>
                        
                        <div className={styles['conversation__heading-picture']}>{user?.name.substring(0, 1)}</div>
                        <p className={styles['conversation__heading-name']}>{user?.name}</p>
                    </div>
                )}
            </div>
            <div className={styles['conversation__body']}>
                {isMsgLoading ? (
                    <div className="loader">loading</div>
                ) : (
                    <div className={styles['conversation__body-content']}>
                        {messages?.length > 0 ? (messages?.sort((a,b) => {
                            if (a.timestamp < b.timestamp) {
                                return -1
                            } else if (a.timestamp > b.timestamp) {
                                return 1
                            }
                            return 0
                        }).map((message, mIndex) => {

                            return (
                                <div key={'message-'+mIndex} className={`${styles['message']} ${message.authorId == selfId ? styles['message--self'] : styles['message--user']}`}>
                                    {message.authorId != selfId ? (
                                        <p className={styles['message__author']}>
                                            {user?.name}
                                        </p>
                                    ) : ''}
                                    
                                    <p className={styles['message__bubble']}>{message?.body}</p>
                                </div>
                            )
                        })) : (
                            <div className={styles['conversation__body-empty']}>Rien à afficher, envoyez le premier message.</div>
                        )}
                    </div>
                )}
            </div>
            <div className={styles['conversation__footer']}>
                <input 
                    ref={inputRef}
                    type='text' 
                    className={styles['conversation__footer-input']} 
                    placeholder="Aa" 
                    onKeyUp={(e) => {
                        if (e.key === 'Enter' || e.keyCode === 13) {
                            sendMessage(inputRef?.current?.value)
                        }
                    }}
                />
		    </div>
		</div>
	)
}

export async function getServerSideProps(context) {
    return {
      props: {},
    };
  }

export default Conversation