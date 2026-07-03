import { useNavigate, useRouter } from '@tanstack/react-router';

interface GetRoutingEventHandlerObjectOption {
  to: string;
  params?: Record<string, string | number>;
}

/**
 * tanstack router 의 preloading 과 navigation 을 동시에 지원하는 훅
 *
 * @returns navigate, preloadRoute, getRoutingEventHandlerObject
 * - navigate: tanstack router 의 navigate 함수
 * - preloadRoute: tanstack router 의 preloadRoute 함수
 * - getRoutingEventHandlerObject: preloading 과 navigation 을 동시에 지원하는 이벤트 핸들러 객체를 반환하는 함수
 */
export const usePreloadNavigate = () => {
  const navigate = useNavigate();
  const { preloadRoute } = useRouter();

  /**
   * preloading 과 navigation 을 동시에 지원하는 이벤트 핸들러 객체를 반환하는 함수
   * @param toObject navigate 할 경로를 나타내는 객체
   * @param withPreload preloading 여부 (기본값: true)
   * @returns 이벤트 핸들러 객체
   *
   * @example
   * ```tsx
   * <Card {...getRoutingEventHandlerObject({ to: '/artist/123' })} />
   * ```
   */
  const getRoutingEventHandlerObject = (toObject: GetRoutingEventHandlerObjectOption, withPreload = true) => {
    const handlers: Partial<React.DOMAttributes<HTMLElement>> = {
      onClick: () => navigate(toObject),
    };

    if (withPreload) {
      handlers.onMouseEnter = () => preloadRoute(toObject);
      handlers.onTouchStart = () => preloadRoute(toObject);
    }

    return handlers;
  };

  return { navigate, preloadRoute, getRoutingEventHandlerObject };
};
