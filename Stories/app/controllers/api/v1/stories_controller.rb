class Api::V1::StoriesController < Api::BaseController

  before_action :load_story, only: [:show, :edit, :update, :destroy]
  before_action :require_login, only: [:create, :update, :destroy]

  def index
    @stories = Story.all
    render json: @stories
  end

  def show
    render json: @story
  end

  def create
    story = Story.new(story_params)
    story.save!
    render json: story
  rescue ActiveRecord::RecordInvalid
    render json: { message: 'Invalid story',
                   errors:  story.errors }, status: 422
  end

  def update
    @story.update_attributes(story_params)
    @story.save!
    render json: @story
  rescue ActiveRecord::RecordInvalid
    render json: { message: 'Invalid story',
                   errors:   @story.errors}, status: 422
  end

  def destroy
    @story.destroy
    render json: @story
  end

private

  def load_story
    @story = Story.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { message: 'Story not found',
                   params:  params }, status: 404
  end

  def story_params
    params.fetch(:story, {}).permit(:title, :url)
  end

end