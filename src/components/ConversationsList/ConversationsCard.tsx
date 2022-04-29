import type { FC } from 'react'
import Link from 'next/link'
import styles from '../../styles/ConversationList.module.css'
import { Conversation } from '../../types/conversation'
import { getLoggedUserId } from '../../utils/getLoggedUserId'

const ConversationCard: FC<Conversation> = ({
    id,
    lastMessageTimestamp,
    recipientId,
    recipientNickname,
    senderId,
    senderNickname,
}) => {
    const selfId = getLoggedUserId()
    const userId = (selfId == recipientId) ? senderId : recipientId
    const userNickname = (selfId == recipientId) ? senderNickname : recipientNickname
    return (
        <div className={styles['conversationCard']}>
            <Link
                href={{
                    pathname: '/conversation',
                    query: { id: id },
                }} as={`/conversation/${id}`}
            >
                <div className={styles['conversationCard__wrapper']}>
                    <div className={styles['conversationCard__visual']}>{userNickname.substring(0, 1)}</div>
                    <div className={styles['conversationCard__content']}>
                        <p className={styles['conversationCard__name']}>{userNickname}</p>
                        <div className={styles['conversationCard__infos']}>
                            
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ConversationCard