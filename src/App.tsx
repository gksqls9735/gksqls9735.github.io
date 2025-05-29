import React, { useState, useEffect, useRef } from 'react';

import { sectionTasks } from './mocks/task-mock';
import { sections } from './mocks/task-mock';
import { chatlist } from './mocks/task-detail-mock';
import { statusSelect } from './mocks/select-option-mock';
import { user1, userlist } from './mocks/user-mock'; // 간트용 사용자 데이터
import type { Chat, Section, SelectOption, Task, User } from './types/type';


function App() {
  // 현재 보여줄 뷰 모드 상태 (예: 'kanban', 'gantt')
  const [viewMode, setViewMode] = useState<'kanban' | 'gantt'>('kanban');

  // 웹 컴포넌트 참조
  const kanbanRef = useRef<HTMLElement & { /* 필요한 메서드 타입 명시 */ }>(null);
  const ganttRef = useRef<HTMLElement & { /* 필요한 메서드 타입 명시 */ }>(null);

  // 애플리케이션 상태 (칸반/간트 공용 또는 개별 상태)
  const [appTasks, setAppTasks] = useState<Task[]>(sectionTasks);
  const [appSections, setAppSections] = useState<Section[]>(sections);
  const [appStatusList, setAppStatusList] = useState<SelectOption[]>(statusSelect);
  // 간트용 사용자 상태 (필요에 따라 추가)
  const [appUser, setAppUser] = useState<User>(user1);
  const [appUserList, setAppUserList] = useState<User[]>(userlist);

  // 채팅
  // 전체 채팅 목록을 관리하는 상태
  const [globalChatlist, setGlobalChatlist] = useState<Chat[]>(chatlist);
  // 현재 상세보기 중인 태스크의 채팅 목록
  const [currentTaskChatList, setCurrentTaskChatList] = useState<Chat[]>([]);
  // 현재 상세보기 중인 태스크의 ID
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // --- 칸반 이벤트 핸들러 ---
  useEffect(() => {
    const kanbanElement = kanbanRef.current;
    if (!kanbanElement || viewMode !== 'kanban') return; // 칸반 모드일 때만 활성화

    const onTasksChanged = (e: CustomEvent<Task[]>) => {
      console.log("Kanban Tasks updated from WC:", e.detail);
      setAppTasks(e.detail);
    };
    const onSectionsChanged = (e: CustomEvent<Section[]>) => {
      console.log("Kanban Sections updated from WC:", e.detail);
      setAppSections(e.detail);
    };
    const onChatlistChanged = (e: CustomEvent<Chat[]>) => {
      const updatedChatsForCurrentTask = e.detail;
      console.log("Chats updated for current task from WC:", updatedChatsForCurrentTask);

      if (selectedTaskId) {
        const otherTasksChats = globalChatlist.filter(chat => chat.taskId !== selectedTaskId);
        const newGlobalChatlist = [...otherTasksChats, ...updatedChatsForCurrentTask];
        setGlobalChatlist(newGlobalChatlist);

        setCurrentTaskChatList(updatedChatsForCurrentTask);
      }
    };
    const onStatusListChanged = (e: CustomEvent<SelectOption[]>) => { // 이벤트 명칭은 웹 컴포넌트와 일치해야 합니다.
      console.log("Kanban StatusList updated from WC: ", e.detail);
      setAppStatusList(e.detail);
    };
    const onDetailTaskSelected = (e: CustomEvent<string>) => {
      const taskId = e.detail;
      console.log("Detail task selected from WC:", taskId);
      setSelectedTaskId(taskId); // 현재 선택된 태스크 ID 저장

      // 전체 채팅 목록에서 해당 태스크의 채팅만 필터링하여 현재 채팅 목록으로 설정
      const chatsForSelectedTask = globalChatlist.filter(chat => chat.taskId === taskId);
      setCurrentTaskChatList(chatsForSelectedTask);
    };

    kanbanElement.addEventListener("tasksChanged", onTasksChanged as EventListener);
    kanbanElement.addEventListener("sectionsChanged", onSectionsChanged as EventListener);
    kanbanElement.addEventListener("chatlistChanged", onChatlistChanged as EventListener);
    kanbanElement.addEventListener("statuslistChanged", onStatusListChanged as EventListener); // 이벤트 명칭 확인
    kanbanElement?.addEventListener("selectedDetailTask", onDetailTaskSelected as EventListener);

    return () => {
      kanbanElement.removeEventListener("tasksChanged", onTasksChanged as EventListener);
      kanbanElement.removeEventListener("sectionsChanged", onSectionsChanged as EventListener);
      kanbanElement.removeEventListener("chatlistChanged", onChatlistChanged as EventListener);
      kanbanElement.removeEventListener("statuslistChanged", onStatusListChanged as EventListener);
      kanbanElement?.removeEventListener("selectedDetailTask", onDetailTaskSelected as EventListener);
    };
  }, [viewMode, globalChatlist, selectedTaskId]); // viewMode가 변경될 때마다 effect 재실행 (리스너 재등록/해제)

  // --- 간트 이벤트 핸들러 ---
  useEffect(() => {
    const ganttElement = ganttRef.current;
    if (!ganttElement || viewMode !== 'gantt') return; // 간트 모드일 때만 활성화

    // 간트용 이벤트 핸들러 (이벤트 명칭과 detail 구조는 간트 웹 컴포넌트에 맞게 설정)
    const onGanttTasksChanged = (e: CustomEvent<Task[]>) => {
      console.log("Gantt Tasks updated from WC:", e.detail);
      setAppTasks(e.detail); // 칸반과 동일한 태스크 상태를 공유한다고 가정
    };
    const onGanttSectionsChanged = (e: CustomEvent<Section[]>) => {
      console.log("Gantt Sections updated from WC:", e.detail);
      setAppSections(e.detail);
    };
    const onGanttChatlistChanged = (e: CustomEvent<Chat[]>) => {
      const updatedChatsForCurrentTask = e.detail;
      console.log("Chats updated for current task from WC:", updatedChatsForCurrentTask);

      if (selectedTaskId) {
        const otherTasksChats = globalChatlist.filter(chat => chat.taskId !== selectedTaskId);
        const newGlobalChatlist = [...otherTasksChats, ...updatedChatsForCurrentTask];
        setGlobalChatlist(newGlobalChatlist);

        setCurrentTaskChatList(updatedChatsForCurrentTask);
      }
    };
    const onGanttStatusListChanged = (e: CustomEvent<SelectOption[]>) => {
      console.log("Gantt StatusList updated from WC: ", e.detail);
      setAppStatusList(e.detail);
    };
    const onGanttDetailTaskSelected = (e: CustomEvent<string>) => {
      const taskId = e.detail;
      console.log("Detail task selected from WC:", taskId);
      setSelectedTaskId(taskId); // 현재 선택된 태스크 ID 저장

      // 전체 채팅 목록에서 해당 태스크의 채팅만 필터링하여 현재 채팅 목록으로 설정
      const chatsForSelectedTask = globalChatlist.filter(chat => chat.taskId === taskId);
      setCurrentTaskChatList(chatsForSelectedTask);
    };

    ganttElement.addEventListener("tasksChanged", onGanttTasksChanged as EventListener);
    ganttElement.addEventListener("sectionsChanged", onGanttSectionsChanged as EventListener);
    ganttElement.addEventListener("chatlistChanged", onGanttChatlistChanged as EventListener);
    ganttElement.addEventListener("statuslistChanged", onGanttStatusListChanged as EventListener);
    ganttElement.addEventListener("selectedDetailTask", onGanttDetailTaskSelected as EventListener);

    return () => {
      ganttElement.removeEventListener("tasksChanged", onGanttTasksChanged as EventListener);
      ganttElement.removeEventListener("sectionsChanged", onGanttSectionsChanged as EventListener);
      ganttElement.removeEventListener("chatlistChanged", onGanttChatlistChanged as EventListener);
      ganttElement.removeEventListener("statuslistChanged", onGanttStatusListChanged as EventListener);
      ganttElement.removeEventListener("selectedDetailTask", onGanttDetailTaskSelected as EventListener);
    };
  }, [viewMode, globalChatlist, selectedTaskId]); // viewMode가 변경될 때마다 effect 재실행

  // 뷰 모드 전환 함수
  const toggleViewMode = () => {
    setViewMode(prevMode => prevMode === 'kanban' ? 'gantt' : 'kanban');
  };

  // selectedTaskId가 변경되면 currentTaskChatList를 업데이트하는 useEffect (선택적 개선)
  useEffect(() => {
    if (selectedTaskId) {
      const chatsForSelectedTask = globalChatlist.filter(chat => chat.taskId === selectedTaskId);
      setCurrentTaskChatList(chatsForSelectedTask);
    } else {
      setCurrentTaskChatList([]); // 선택된 태스크가 없으면 빈 배열
    }
  }, [selectedTaskId, globalChatlist]);


  return (
    <>
      <div className="view-mode-toggle" style={{paddingBottom: 40}}>
        <button onClick={toggleViewMode}>
          Switch to {viewMode === 'kanban' ? 'Gantt Chart' : 'Kanban Board'}
        </button>
      </div>

      {/* 현재 뷰 모드에 따라 해당 웹 컴포넌트를 렌더링 */}
      {viewMode === 'kanban' && (
        <kanban-board
          ref={kanbanRef}
          tasks={JSON.stringify(appTasks)}
          sections={JSON.stringify(appSections)}
          statuslist={JSON.stringify(appStatusList)}
          currentUser={JSON.stringify(appUser)} // 칸반용 사용자 데이터 (user1 또는 다른 적절한 데이터)
          userlist={JSON.stringify(appUserList)}
          isSideMenuOpen="hidden" // 필요에 따라 상태로 관리 가능
          chatlist={JSON.stringify(currentTaskChatList)}
        ></kanban-board>
      )}

      {viewMode === 'gantt' && (
        <gantt-chart
          ref={ganttRef}
          user={JSON.stringify(appUser)} // 간트용 사용자 데이터
          userlist={JSON.stringify(appUserList)}
          tasks={JSON.stringify(appTasks)}
          sections={JSON.stringify(appSections)}
          statusList={JSON.stringify(appStatusList)} // JSX 타입 정의와 일치하도록 statusList 사용
          isSideMenuOpen="hidden" // 필요에 따라 상태로 관리 가능
          chatlist={JSON.stringify(currentTaskChatList)}
        // viewtype="day" // 간트 차트 초기 뷰타입 (필요시 추가)
        ></gantt-chart>
      )}
    </>
  );
}

export default App;