defmodule LivebookWeb.Output.CanvasStaticComponent do
  use LivebookWeb, :live_component

  @impl true
  def update(assigns, socket) do
    socket = 
      socket
      |> assign(id: assigns.id)
      |> assign(width: assigns.width)
      |> assign(height: assigns.height)

    {:ok, push_event(socket, "canvas:#{socket.assigns.id}:init", %{"ops" => assigns.ops})}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div id={"canvas-#{@id}"} phx-hook="Canvas" phx-update="ignore" data-id={@id} width={@width} height={@height} >
    </div>
    """
  end
end
