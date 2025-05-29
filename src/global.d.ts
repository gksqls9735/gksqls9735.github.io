declare global {
  namespace JSX {
    interface IntrinsicElements {
      "kanban-board": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          tasks: string;
          sections: string;
          statuslist: string;
          currentUser: string;
          userlist: string;
          isSideMenuOpen: string;
          chatlist: string;
        },
        HTMLElement
      >;
      "gantt-chart": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          user: string;
          userlist: string;
          tasks: string;
          sections: string;
          statusList: string;
          isSideMenuOpen: string;
          chatlist: string;
        },
        HTMLElement
      >;
    }
  }
}
export { };
